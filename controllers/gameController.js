const { Game, Place, Option, Payment, Photo, Note } = require("../models");
const { Op, where } = require("sequelize");

exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll({
      include: [
        { model: Place, include: [Photo] },
        {
          model: Payment,
        },
      ],
    });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGamesWithDateFilter = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = {};

    // 날짜 필터 적용 (시작일자 ~ 종료일자)
    if (startDate) {
      whereClause.date = { [Op.gte]: new Date(startDate) }; // 시작일자 (이후)
    }

    if (endDate) {
      whereClause.date = whereClause.date
        ? { ...whereClause.date, [Op.lte]: new Date(endDate) } // 종료일자 (이전)
        : { [Op.lte]: new Date(endDate) };
    }

    const games = await Game.findAll({
      where: whereClause,
      include: [
        {
          model: Place,
          include: [Photo],
        },
        {
          model: Payment,
        },
      ],
      order: [["date", "ASC"]],
    });

    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게임 데이터 조회 실패" });
  }
};

// Id로 게임 조회하기
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id, {
      include: [
        { model: Place, include: [Option, Photo, Note] },
        {
          model: Payment,
        },
      ],
    });
    if (game) res.json(game);
    else res.status(404).json({ error: "Game not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 게임 정보 업데이트 하기
exports.updateGame = async (req, res) => {
  try {
    const [updated] = await Game.update(req.body, {
      where: { gameId: req.params.id },
    });
    if (updated) res.json({ message: "Game updated" });
    else res.status(404).json({ error: "Game not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 게임 종료 하기
exports.updateGameIsEnd = async (req, res) => {
  try {
    const gameId = req.params.id;

    // 1. 게임 종료 처리
    const [updated] = await Game.update(req.body, {
      where: { gameId },
    });

    if (!updated) return res.status(404).json({ error: "Game not found" });
    console.log("게임종료 완료!");
  } catch (err) {
    console.error("❌ 게임 종료 처리 중 오류:", err);
    res.status(500).json({ error: err.message });
  }
};

// 게임 삭제하기
exports.deleteGame = async (req, res) => {
  try {
    const deleted = await Game.destroy({
      where: { gameId: req.params.id },
    });
    if (deleted) res.json({ message: "Game deleted" });
    else res.status(404).json({ error: "Game not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

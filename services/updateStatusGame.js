const { Game, Payment } = require("../models");

// 게임 모집 확인하기
const updateRecruitingGame = async (gameId) => {
  try {
    const game = await Game.findOne({
      where: { gameId },
    });

    if (!game) {
      throw new Error("Game not found");
    }

    // ✅ 확정된 인원 수 조회
    const confirmedCount = await Payment.count({
      where: {
        gameId,
        isConfirmed: true,
      },
    });

    // ✅ 인원 수가 다 찼을 경우 모집 마감
    if (confirmedCount >= game.numOfMember) {
      game.isRecruiting = false;
      await game.save();
      return { success: true, message: "모집이 마감되었습니다." };
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 게임 종료 확인하기
const updateFinishingGame = async (gameId) => {
  try {
    const game = await Game.findOne({
      where: { gameId },
    });

    // ✅ 인원 수가 다 찼을 경우 모집 마감
    if (game) {
      game.isFinished = true;
      await game.save();
      return { success: true, message: "게임이 종료되었습니다." };
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  updateRecruitingGame,
  updateFinishingGame,
};

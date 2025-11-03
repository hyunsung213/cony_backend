const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.post("/", gameController.createGame); // 게임 생성
router.get("/", gameController.getAllGames); // 전체 게임 조회
router.get("/date", gameController.getGamesWithDateFilter); // 날짜 별로 게임 조회
router.get("/:id", gameController.getGameById); // 특정 게임 조회
router.put("/end/:id", gameController.updateGameIsEnd); // 게임 끝내기
router.put("/:id", gameController.updateGame); // 게임 수정
router.delete("/:id", gameController.deleteGame); // 게임 삭제

module.exports = router;

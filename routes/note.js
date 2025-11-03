const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

router.post("/", noteController.createNote); // 옵션 생성
router.get("/", noteController.getAllNotes); // 전체 옵션 조회
router.get("/:id", noteController.getNoteById); // 특정 옵션 조회
router.put("/:id", noteController.updateNote); // 옵션 수정
router.delete("/:id", noteController.deleteNote); // 옵션 삭제

module.exports = router;

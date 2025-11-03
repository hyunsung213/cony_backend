const express = require("express");
const router = express.Router();
const optionController = require("../controllers/optionController");

router.post("/", optionController.createOption); // 옵션 생성
router.get("/", optionController.getAllOptions); // 전체 옵션 조회
router.get("/:id", optionController.getOptionById); // 특정 옵션 조회
router.put("/:id", optionController.updateOption); // 옵션 수정
router.delete("/:id", optionController.deleteOption); // 옵션 삭제

module.exports = router;

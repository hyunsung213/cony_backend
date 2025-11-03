const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/", paymentController.createPayment); // 참가
router.delete("/", paymentController.deletePayment); // 참가 취소
router.put("/confirm", paymentController.confirmPayment); // 참가신청 확인
router.put("/deny", paymentController.denyPayment); // 참가신청 확인
router.get("/game/:gameId", paymentController.getPaymentsByGame); // 게임별 조회

module.exports = router;

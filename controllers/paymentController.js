const { Game, Place, Payment } = require("../models");
const { updateRecruitingGame } = require("../services/updateStatusGame");
const { SolapiMessageService } = require("solapi");
const axios = require("axios");

const SOLAPI_API_KEY = process.env.SOLAPI_API_KEY;
const SOLAPI_API_SECRET = process.env.SOLAPI_API_SECRET;
const from_number = process.env.SOLAPI_FROM_NUMBER;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET || !from_number) {
  console.warn(
    "[SOLAPI] 환경변수(SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_FROM_NUMBER)를 확인하세요."
  );
}
const messageService = new SolapiMessageService(
  SOLAPI_API_KEY,
  SOLAPI_API_SECRET
);

// Discord Webhook URL (환경 변수로 관리 추천)
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

exports.createPayment = async (req, res) => {
  try {
    const { gameId, userPhoneNum } = req.body;

    const game = await Game.findByPk(gameId, {
      include: [
        { model: Place },
        {
          model: Payment,
        },
      ],
    });
    if (!game) return res.status(404).json({ message: "게임 없음" });

    console.log("참가자 정보: ", req.body);

    // ✅ 확정된 인원 수 조회
    const confirmedCount = await Payment.count({
      where: {
        gameId,
        isConfirmed: true,
      },
    });

    // ✅ 정원이 다 찼다면 참가 신청 불가
    if (confirmedCount >= game.numOfMember) {
      return res
        .status(400)
        .json({ message: "정원이 모두 찼습니다. 참가 신청이 불가능합니다." });
    }

    // ✅ 중복 신청 불가
    const existing = await Payment.findOne({ where: { gameId, userPhoneNum } });
    if (existing) return res.status(400).json({ message: "이미 신청됨" });

    const payment = await Payment.create({
      gameId,
      userPhoneNum,
      ...req.body,
    });

    // ✅ Discord 알림 보내기
    try {
      // 게임 정보
      const gameInfo = `🎮 **게임 정보**\n- 게임 ID: ${gameId}\n- 날짜: ${new Date(
        game.date
      ).toLocaleString()}\n- 최대 인원: ${game.numOfMember}`;

      // 장소 정보
      const placeInfo = `📍 **장소 정보**\n- 장소 이름: ${
        game.Place?.placeName || "정보 없음"
      }\n- 주소: ${game.Place?.location || "정보 없음"}`;

      // 참가자 정보
      const participantInfo = `🙋 **참가자 정보**\n- 이름/전화: ${
        payment.userName ?? "회원"
      } / ${userPhoneNum}\n- 현재 확정 인원: ${confirmedCount + 1}/${
        game.numOfMember
      }`;

      // 최종 메시지
      const message = [gameInfo, placeInfo, participantInfo].join("\n\n");

      await axios.post(DISCORD_WEBHOOK_URL, { content: message });
    } catch (discordErr) {
      console.error("Discord 알림 오류:", discordErr);
    }

    // 결제창으로 이동 (프론트에서)
    res.status(201).json(payment);
  } catch (err) {
    console.error("참가 신청 오류:", err);
    res.status(500).json({ error: err.message });
  }
};

//  결제 후 참가확정
exports.confirmPayment = async (req, res) => {
  try {
    const { gameId, userPhoneNum } = req.body;
    const payment = await Payment.findOne({
      where: { gameId, userPhoneNum, isConfirmed: false },
    });

    if (!payment) {
      return res
        .status(404)
        .json({ message: "참가 내역이 없거나 이미 확정됨" });
    }

    payment.isConfirmed = true;
    await payment.save();
    await updateRecruitingGame(gameId);
    // 4) 참가 확정 문자 발송 준비
    const game = await Game.findByPk(gameId, {
      include: [{ model: Place }],
    });
    if (!game) {
      console.warn(
        `[confirmPayment] gameId ${gameId}에 대한 Game 레코드가 없습니다.`
      );
    }

    // 5) SMS 텍스트 구성
    const gameDate =
      game && game.date
        ? new Date(game.date).toLocaleString("ko-KR", {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "일시 미정";

    const placeName = game?.Place?.placeName ?? "장소 정보 없음";
    const detailUrl = `${BASE_URL.replace(/\/$/, "")}/game/${gameId}`;

    const messageText = [
      "📢 [참가 확정 안내]",
      `${payment.userName ?? "회원"}님, 참가가 확정되었습니다.`,
      "",
      `📅 날짜: ${gameDate}`,
      `📍 장소: ${placeName}`,
      `🔗 상세보기: ${detailUrl}`,
      `❓ 문의사항: 010-2655-6262`,
      "",
      "즐거운 게임 되세요 🏸",
    ].join("\n");

    // 6) 수신번호 국제표준 형태로 변환 (예: 01012345678 -> +821012345678)
    to_number = payment.userPhoneNum.replace(/[^0-9]/g, "");
    console.log(`[SMS] 참가 확정 문자 발송 준비 to: ${to_number}`);
    console.log(`[SMS] 내용: ${messageText}`);
    console.log(`[SMS] 발신번호: ${from_number}`);

    try {
      await messageService.send({
        to: to_number,
        from: from_number,
        text: messageText,
        type: "LMS",
      });
    } catch (error) {
      console.error("❌ Solapi Error:", error.message);
      console.error(error);
    }

    // 8) 성공 응답
    return res.json({ message: "결제 완료 및 참가 확정 (문자 발송됨)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 게임 참가 취소
exports.denyPayment = async (req, res) => {
  try {
    const { gameId, userPhoneNum } = req.body;
    const payment = await Payment.findOne({
      where: { gameId, userPhoneNum, isConfirmed: true },
    });

    if (!payment) {
      return res
        .status(404)
        .json({ message: "참가 내역이 없거나 이미 확정됨" });
    }

    payment.isConfirmed = false;
    await payment.save();
    await updateRecruitingGame(gameId);
    res.json({ message: "참가 취소 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 게임 참가 취소
exports.deletePayment = async (req, res) => {
  try {
    const { gameId, userPhoneNum } = req.body;
    const deleted = await Payment.destroy({
      where: { gameId, userPhoneNum },
    });
    if (deleted) {
      console.log(`게임ID ${gameId} 참가자 ${userPhoneNum} 참가 취소됨`);
      res.json({ message: "참가 취소 완료" });
    } else res.status(404).json({ error: "참가 내역 없음" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 특정 게임 참가자 목록 조회
exports.getPaymentsByGame = async (req, res) => {
  try {
    const { gameId } = req.body;

    const payments = await Payment.findAll({
      where: { gameId },
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

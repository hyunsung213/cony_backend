const cron = require("node-cron");
const dayjs = require("dayjs");
const { Game, Place, Payment } = require("../models"); // Sequelize 모델
const { Op } = require("sequelize");

async function createDailyGames() {
  try {
    const today = dayjs().format("YYYY-MM-DD");
    const gameTime = "11:00"; // 기본 시작 시간
    const datetime = dayjs(`${today} ${gameTime}`).toDate();
    const ids = [1, 2, 3, 4];
    console.log(`[게임 자동생성] ${today} 날짜 기준 실행 중...`);

    for (const id of ids) {
      const place = await Place.findByPk(id);
      // 이미 해당 장소에 오늘 날짜의 게임이 존재하는지 확인
      const existing = await Game.findOne({
        where: {
          placeId: place.placeId,
          date: today,
        },
      });

      if (existing) {
        console.log(`⏭ 이미 ${place.name} 장소의 ${today} 게임이 존재함`);
        continue;
      }

      // 새로운 게임 생성
      const game = await Game.create({
        placeId: place.placeId,
        date: datetime,
        numOfMember: 5, // 기본 인원
        cost: 13000, // 기본 가격
        isRecruiting: false,
        isFinished: false,
      });

      console.log(`✅ ${place.name} 장소의 ${today} 게임 자동 생성 완료`);

      for (let i = 0; i < 5; i++) {
        await Payment.create({
          gameId: game.gameId,
          userName: "system",
          userPhoneNum: "000-0000-0000",
          userEmail: "system@system.com",
          isConfirmed: true,
        });
        console.log(`   - 더미 결제자 ${i + 1}명 추가 완료`);
      }
    }

    console.log("모든 장소의 게임 자동 생성 완료 ✅");
  } catch (error) {
    console.error("❌ 게임 자동 생성 실패:", error);
  }
}

cron.schedule("00 00 * * *", () => {
  createDailyGames();
});

module.exports = { createDailyGames };

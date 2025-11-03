require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// 라우터 불러오기
const placeRoutes = require("./routes/place");
const gameRoutes = require("./routes/game");
const optionRoutes = require("./routes/option");
const photoRoutes = require("./routes/photo");
const noteRoutes = require("./routes/note");
const paymentRoutes = require("./routes/payment");

// 미들웨어
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_SERVER,
    credentials: true,
  })
);

// 정적 파일 서비스
app.use("/uploads", express.static("uploads"));

// 라우터 연결
app.use("/places", placeRoutes);
app.use("/games", gameRoutes);
app.use("/options", optionRoutes);
app.use("/payments", paymentRoutes);
app.use("/notes", noteRoutes);
app.use("/photos", photoRoutes);

// DB 연결 및 서버 실행
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB 연결 성공");

    await sequelize.sync({ alter: true });
    console.log("✅ 테이블 동기화 완료");

    // ✅ 스케줄러 불러오기 (DB 연결 후 실행)
    require("./services/gameScheduler");

    app.listen(PORT, () => {
      console.log(`🚀 서버 실행 중`);
    });
  } catch (error) {
    console.error("❌ 초기화 실패:", error);
  }
};

startServer();

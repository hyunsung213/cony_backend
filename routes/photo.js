const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadPhoto,
  getPhotosByPlace,
  deletePhoto,
} = require("../controllers/photoController");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

// 사진 업로드
router.post("/places/:placeId", upload.single("photo"), uploadPhoto);

// 특정 장소의 사진 전체 조회
router.get("/places/:placeId/photos", getPhotosByPlace);

// 사진 삭제
router.delete("/:photoId", deletePhoto);

module.exports = router;

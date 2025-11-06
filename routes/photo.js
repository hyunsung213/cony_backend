const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadPhoto,
  getPhotosByPlace,
  deletePhoto,
} = require("../controllers/photoController");
const path = require("path");
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png 등 확장자
    const uniqueName =
      Date.now() + "_" + Math.random().toString(36).substring(2, 10) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 사진 업로드
router.post("/places/:placeId", upload.single("photo"), uploadPhoto);

// 특정 장소의 사진 전체 조회
router.get("/places/:placeId/photos", getPhotosByPlace);

// 사진 삭제
router.delete("/:photoId", deletePhoto);

module.exports = router;

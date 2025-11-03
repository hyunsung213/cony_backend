const { Photo, Place } = require("../models");

exports.uploadPhoto = async (req, res) => {
  try {
    const { placeId } = req.params;

    const place = await Place.findByPk(placeId);
    if (!place) {
      return res.status(404).json({ error: "해당 장소가 존재하지 않습니다." });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    const photo = await Photo.create({
      placeId: Number(placeId),
      photoUrl,
    });

    res.status(201).json({
      message: "사진 업로드 완료",
      photo,
    });
  } catch (err) {
    console.error("❌ 사진 업로드 실패:", err);
    res.status(500).json({ error: "사진 업로드 실패" });
  }
};

// 📌 특정 장소의 사진 전체 조회
exports.getPhotosByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    const photos = await Photo.findAll({ where: { placeId } });
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "사진 조회 실패" });
  }
};

// 📌 사진 삭제
exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await Photo.findByPk(photoId);
    if (!photo)
      return res.status(404).json({ error: "사진을 찾을 수 없습니다." });

    await photo.destroy();
    res.json({ message: "사진 삭제 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "사진 삭제 실패" });
  }
};

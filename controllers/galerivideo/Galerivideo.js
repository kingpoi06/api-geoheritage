import Galerivideo from "../../models/galerivideo/GalerivideoModel.js";
import Users from "../../models/UserModel.js";
// import { Readable } from 'stream';
// import upload from "../../middleware/multerConfig.js";
// import cloudinary from "../../middleware/cloudinary.js";

export const getGalerivideo = async (req, res) => {
  try {
      const response = await Galerivideo.findAll({
        attributes: [
        "id",
          "uuid",
          "titlevideo",
          "video",
          "contentvideo",
          "createdAt",
        ],
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
};

export const getGalerivideoById = async (req, res) => {
  try {
      const response = await Galerivideo.findOne({
        attributes: [
          "id",
          "uuid",
          "titlevideo",
          "video",
          "contentvideo",
          "createdAt",
      ],
        where: {
          id: req.params.uuid,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
};

export const createGalerivideo = async (req, res) => {
    const { titlevideo, video, contentvideo } = req.body;
    try {
      await Galerivideo.create({
        titlevideo: titlevideo,
        video: video,
        contentvideo: contentvideo,
        userId: req.userDbId,
      });
      res.status(201).json({ msg: "Data Galeri video Berhasil Ditambahkan!" });
    } catch (error) {
      console.error("Error creating Galeri video:", error);
      res.status(500).json({ msg: error.message });
    }
  };

  export const updateGalerivideo = async (req, res) => {
    try {
      const galerivideo = await Galerivideo.findOne({
        where: {
          id: req.params.uuid,
        },
      });
      if (!galerivideo) return res.status(404).json({ msg: "Data not found!" });
      const { titlevideo, video, contentvideo } = req.body;
      if (req.role === "admin") {
        await Galerivideo.update(
          { titlevideo, video, contentvideo },
          {
            where: {
              id: galerivideo.id,
            },
          }
        );
      } else {
        if (req.userId !== galerivideo.userId)
          return res.status(403).json({ msg: "Access X" });
        await Galerivideo.update(
          { titlevideo, video, contentvideo },
          {
            where: {
              [Op.and]: [{ id: galerivideo.id }, { userId: req.userId }],
            },
          }
        );
      }
      res.status(200).json({ msg: "Data Galeri Video berhasil di perbaharui!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

export const deletegalerivideo = async (req, res) => {
  try {
    const galerivideo = await Galerivideo.findOne({
      where: {
        id: req.params.uuid,
      },
    });
    if (!galerivideo) return res.status(404).json({ msg: "Data not found!" });
    const { titlevideo, video, contentvideo } = req.body;
    if (req.role === "admin") {
      await Galerivideo.destroy({
        where: {
          id: galerivideo.id,
        },
      });
    } else {
      if (req.userId !== galerivideo.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Galerivideo.destroy({
        where: {
          [Op.and]: [{ id: galerivideo.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data Galeri Video berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

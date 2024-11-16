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
          "image",
          "urlvideo",
          "kategori",
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
          "image",
          "urlvideo",
          "kategori",
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
  const { titlevideo, kategori, urlvideo } = req.body;
  
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'File gambar wajib diunggah' });
    }

    // Unggah gambar ke Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'galerivideo_images' },
      async (err, result) => {
        if (err) {
          console.error("Error uploading to Cloudinary:", err);
          return res.status(500).json({ success: false, message: "Error uploading to Cloudinary" });
        }

        const imageUrl = result.secure_url;

        await Galerivideo.create({
          titlevideo: titlevideo,
          image: imageUrl,  
          kategori: kategori,
          urlvideo: urlvideo,
          userId: req.userDbId,
        });

        res.status(201).json({ msg: "Data Galeri Video Berhasil Ditambahkan!", imageUrl: imageUrl });
      }
    );

    // Mengalirkan buffer file ke Cloudinary
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);

  } catch (error) {
    console.error("Error creating Galeri Video:", error);
    res.status(500).json({ msg: error.message });
  }
};

  export const updateGalerivideo = async (req, res) => {
    try {
      const galerivideo = await Galerivideo.findOne({
        where: { id: req.params.uuid },
      });
      if (!galerivideo) return res.status(404).json({ msg: "Data tidak ditemukan!" });
  
      const { titlevideo, kategori, urlvideo } = req.body;
      let imageUrl = galerivideo.image;
  
      // Cek jika ada file gambar baru yang diunggah
      if (req.file) {
        // Hapus gambar lama dari Cloudinary
        const publicId = galerivideo.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
  
        // Unggah gambar baru ke Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'galerivideo_images' },
          (err, result) => {
            if (err) {
              console.error("Error uploading to Cloudinary:", err);
              return res.status(500).json({ success: false, message: "Error uploading to Cloudinary" });
            }
            imageUrl = result.secure_url;
          }
        );
  
        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
      }
  
      // Update data Galeri poto di database
      const updateData = { titlevideo, image: imageUrl, kategori, urlvideo };
      const condition = req.role === "admin" ? { id: galerivideo.id } : { [Op.and]: [{ id: galerivideo.id }, { userId: req.userId }] };
  
      await Galerivideo.update(updateData, { where: condition });
      res.status(200).json({ msg: "Data Galeri Video berhasil diperbaharui!" });
      
    } catch (error) {
      console.error("Error updating Galeri Video:", error);
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
    const { titlevideo, video, kategori } = req.body;
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

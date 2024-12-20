import Galeripoto from "../../models/galeripoto/GaleripotoModel.js";
import Users from "../../models/UserModel.js";
import { Readable } from 'stream';
// import upload from "../../middleware/multerConfig.js";
import cloudinary from "../../middleware/cloudinary.js";

export const getGaleripoto = async (req, res) => {
  try {
      const response = await Galeripoto.findAll({
        attributes: [
        "id",
          "uuid",
          "titleimage",
          "image",
          "kategori",
          "createdAt",
        ],
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
};

export const getGaleripotoById = async (req, res) => {
  try {
      const response = await Galeripoto.findOne({
        attributes: [
          "id",
          "uuid",
          "titleimage",
          "image",
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

export const createGaleripoto = async (req, res) => {
    const { titleimage, kategori } = req.body;
  
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'File gambar wajib diunggah' });
      }
  
      // Unggah gambar ke Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'galeripoto_images' },
        async (err, result) => {
          if (err) {
            console.error("Error uploading to Cloudinary:", err);
            return res.status(500).json({ success: false, message: "Error uploading to Cloudinary" });
          }
  
          const imageUrl = result.secure_url;
  
          await Galeripoto.create({
            titleimage: titleimage,
            image: imageUrl,  
            kategori: kategori,
            userId: req.userDbId,
          });
  
          res.status(201).json({ msg: "Data Galeri Poto Berhasil Ditambahkan!", imageUrl: imageUrl });
        }
      );
  
      // Mengalirkan buffer file ke Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
  
    } catch (error) {
      console.error("Error creating Galeri Poto:", error);
      res.status(500).json({ msg: error.message });
    }
  };

export const updateGaleripoto = async (req, res) => {
    try {
        const galeripoto = await Galeripoto.findOne({
          where: { id: req.params.uuid },
        });
        if (!galeripoto) return res.status(404).json({ msg: "Data tidak ditemukan!" });
    
        const { titleimage, kategori } = req.body;
        let imageUrl = galeripoto.image;
    
        // Cek jika ada file gambar baru yang diunggah
        if (req.file) {
          // Hapus gambar lama dari Cloudinary
          const publicId = galeripoto.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
    
          // Unggah gambar baru ke Cloudinary
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'galeripoto_images' },
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
        const updateData = { titleimage, image: imageUrl, kategori };
        const condition = req.role === "admin" ? { id: galeripoto.id } : { [Op.and]: [{ id: galeripoto.id }, { userId: req.userId }] };
    
        await Galeripoto.update(updateData, { where: condition });
        res.status(200).json({ msg: "Data Galeri poto berhasil diperbaharui!" });
        
      } catch (error) {
        console.error("Error updating Galeri Poto:", error);
        res.status(500).json({ msg: error.message });
      }
    };

export const deleteGaleripoto = async (req, res) => {
  try {
    const galeripoto = await Galeripoto.findOne({
      where: {
        id: req.params.uuid,
      },
    });
    if (!galeripoto) return res.status(404).json({ msg: "Data not found!" });
    const { titleimage, image, kategori } = req.body;
    if (req.role === "admin") {
      await Galeripoto.destroy({
        where: {
          id: galeripoto.id,
        },
      });
    } else {
      if (req.userId !== galeripoto.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Galeripoto.destroy({
        where: {
          [Op.and]: [{ id: galeripoto.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data Galeri Poto berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

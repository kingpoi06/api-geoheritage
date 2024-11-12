import Situsbudaya from "../../models/situsbudaya/SitusbudayaModel.js";
import Users from "../../models/UserModel.js";
import { Readable } from 'stream';
// import upload from "../../middleware/multerConfig.js";
import cloudinary from "../../middleware/cloudinary.js";

export const getSitusbudaya = async (req, res) => {
    try {
        const response = await Situsbudaya.findAll({
          attributes: [
          "id",
          "uuid",
          "title",
          "sinopsis",
          "deskripsilengkap",
          "image",
          "createdAt",
          ],
        });
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
};

export const getSitusbudayaById = async (req, res) => {
    try {
        const response = await Situsbudaya.findOne({
          attributes: [
          "id",
          "uuid",
          "title",
          "sinopsis",
          "deskripsilengkap",
          "image",
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

export const createSitusbudaya = async (req, res) => {
    const { title, sinopsis, deskripsilengkap } = req.body;
  
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'File gambar wajib diunggah' });
      }
  
      // Unggah gambar ke Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'situsbudaya_images' },
        async (err, result) => {
          if (err) {
            console.error("Error uploading to Cloudinary:", err);
            return res.status(500).json({ success: false, message: "Error uploading to Cloudinary" });
          }
  
          const imageUrl = result.secure_url;
  
          await Situsbudaya.create({
            title: title,
            image: imageUrl,  
            sinopsis: sinopsis,
            deskripsilengkap: deskripsilengkap,
            userId: req.userDbId,
          });
  
          res.status(201).json({ msg: "Data Situsbudaya Berhasil Ditambahkan!", imageUrl: imageUrl });
        }
      );
  
      // Mengalirkan buffer file ke Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
  
    } catch (error) {
      console.error("Error creating situsbudaya:", error);
      res.status(500).json({ msg: error.message });
    }
  };

export const updateSitusbudaya = async (req, res) => {
    try {
        const situsbudaya = await Situsbudaya.findOne({
          where: { id: req.params.uuid },
        });
        if (!situsbudaya) return res.status(404).json({ msg: "Data tidak ditemukan!" });
    
        const { titleimage, contentimage } = req.body;
        let imageUrl = situsbudaya.image;
    
        // Cek jika ada file gambar baru yang diunggah
        if (req.file) {
          // Hapus gambar lama dari Cloudinary
          const publicId = situsbudaya.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
    
          // Unggah gambar baru ke Cloudinary
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'situsbudaya_images' },
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
        const updateData = { titleimage, image: imageUrl, contentimage };
        const condition = req.role === "admin" ? { id: situsbudaya.id } : { [Op.and]: [{ id: situsbudaya.id }, { userId: req.userId }] };
    
        await Situsbudaya.update(updateData, { where: condition });
        res.status(200).json({ msg: "Data Situsbudaya berhasil diperbaharui!" });
        
      } catch (error) {
        console.error("Error updating Situsbudaya:", error);
        res.status(500).json({ msg: error.message });
      }
    };

export const deleteSitusbudaya = async (req, res) => {
  try {
    const situsbudaya = await Situsbudaya.findOne({
      where: {
        id: req.params.uuid,
      },
    });
    if (!situsbudaya) return res.status(404).json({ msg: "Data not found!" });
    const { title, sinopsis, deskripsilengkap, image } = req.body;
    if (req.role === "admin") {
      await Situsbudaya.destroy({
        where: {
          id: situsbudaya.id,
        },
      });
    } else {
      if (req.userId !== situsbudaya.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Situsbudaya.destroy({
        where: {
          [Op.and]: [{ id: situsbudaya.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data Situsbudaya berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

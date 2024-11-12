import Petabudaya from "../../models/petabudaya/PetabudayaModel.js";
import Users from "../../models/UserModel.js";
import { Readable } from 'stream';
// import upload from "../../middleware/multerConfig.js";
import cloudinary from "../../middleware/cloudinary.js";

export const getPetabudaya = async (req, res) => {
    try {
        const response = await Petabudaya.findAll({
          attributes: [
          "id",
          "uuid",
          "urlvideo",
          "titikkoordinatpeta",
          "image",
          "createdAt",
          ],
        });
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
};

export const getPetabudayaById = async (req, res) => {
    try {
        const response = await Petabudaya.findOne({
          attributes: [
          "id",
          "uuid",
          "urlvideo",
          "titikkoordinatpeta",
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

export const createPetabudaya = async (req, res) => {
    const { urlvideo, titikkoordinatpeta } = req.body;
  
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'File gambar wajib diunggah' });
      }
  
      // Unggah gambar ke Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'petabudaya_images' },
        async (err, result) => {
          if (err) {
            console.error("Error uploading to Cloudinary:", err);
            return res.status(500).json({ success: false, message: "Error uploading to Cloudinary" });
          }
  
          const imageUrl = result.secure_url;
  
          await Petabudaya.create({
            urlvideo: urlvideo,
            image: imageUrl,  
            titikkoordinatpeta: titikkoordinatpeta,
            userId: req.userDbId,
          });
  
          res.status(201).json({ msg: "Data Petabudaya Berhasil Ditambahkan!", imageUrl: imageUrl });
        }
      );
  
      // Mengalirkan buffer file ke Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
  
    } catch (error) {
      console.error("Error creating Petabudaya:", error);
      res.status(500).json({ msg: error.message });
    }
  };

export const updatePetabudaya = async (req, res) => {
    try {
        const petabudaya = await Petabudaya.findOne({
          where: { id: req.params.uuid },
        });
        if (!petabudaya) return res.status(404).json({ msg: "Data tidak ditemukan!" });
    
        const { turlvideo, titikkoordinatpeta } = req.body;
        let imageUrl = petabudaya.image;
    
        // Cek jika ada file gambar baru yang diunggah
        if (req.file) {
          // Hapus gambar lama dari Cloudinary
          const publicId = petabudaya.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
    
          // Unggah gambar baru ke Cloudinary
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'Petabudaya_images' },
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
        const updateData = { turlvideo, titikkoordinatpeta, image: imageUrl };
        const condition = req.role === "admin" ? { id: petabudaya.id } : { [Op.and]: [{ id: petabudaya.id }, { userId: req.userId }] };
    
        await Petabudaya.update(updateData, { where: condition });
        res.status(200).json({ msg: "Data Petabudaya berhasil diperbaharui!" });
        
      } catch (error) {
        console.error("Error updating Petabudaya:", error);
        res.status(500).json({ msg: error.message });
      }
    };

export const deletePetabudaya = async (req, res) => {
  try {
    const petabudaya = await Petabudaya.findOne({
      where: {
        id: req.params.uuid,
      },
    });
    if (!petabudaya) return res.status(404).json({ msg: "Data not found!" });
    const { turlvideo, titikkoordinatpeta, image } = req.body;
    if (req.role === "admin") {
      await Petabudaya.destroy({
        where: {
          id: petabudaya.id,
        },
      });
    } else {
      if (req.userId !== petabudaya.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Petabudaya.destroy({
        where: {
          [Op.and]: [{ id: petabudaya.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data petabudaya berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

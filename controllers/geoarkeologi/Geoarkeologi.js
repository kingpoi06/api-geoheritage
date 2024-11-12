import Geoarkeologi from "../../models/geoarkeologi/GeoarkeologiModel.js";
import Users from "../../models/UserModel.js";
import { Readable } from 'stream';
// import upload from "../../middleware/multerConfig.js";
import cloudinary from "../../middleware/cloudinary.js";

export const getGeoarkeologi = async (req, res) => {
    try {
        const response = await Geoarkeologi.findAll({
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

export const getGeoarkeologiById = async (req, res) => {
    try {
        const response = await Geoarkeologi.findOne({
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

export const createGeoarkeologi = async (req, res) => {
    const { title, sinopsis, deskripsilengkap } = req.body;
  
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'File gambar wajib diunggah' });
      }
  
      // Unggah gambar ke Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'geoarkeologi_images' },
        async (err, result) => {
          if (err) {
            console.error("Error uploading to Cloudinary:", err);
            return res.status(500).json({ success: false, message: "Error uploading to Cloudinary" });
          }
  
          const imageUrl = result.secure_url;
  
          await Geoarkeologi.create({
            title: title,
            image: imageUrl,  
            sinopsis: sinopsis,
            deskripsilengkap: deskripsilengkap,
            userId: req.userDbId,
          });
  
          res.status(201).json({ msg: "Data Geoarkeologi Berhasil Ditambahkan!", imageUrl: imageUrl });
        }
      );
  
      // Mengalirkan buffer file ke Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
  
    } catch (error) {
      console.error("Error creating Geoarkeologi:", error);
      res.status(500).json({ msg: error.message });
    }
  };

export const updateGeoarkeologi = async (req, res) => {
    try {
        const geoarkeologi = await Geoarkeologi.findOne({
          where: { id: req.params.uuid },
        });
        if (!geoarkeologi) return res.status(404).json({ msg: "Data tidak ditemukan!" });
    
        const { titleimage, contentimage } = req.body;
        let imageUrl = geoarkeologi.image;
    
        // Cek jika ada file gambar baru yang diunggah
        if (req.file) {
          // Hapus gambar lama dari Cloudinary
          const publicId = geoarkeologi.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
    
          // Unggah gambar baru ke Cloudinary
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'geoarkeologi_images' },
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
        const condition = req.role === "admin" ? { id: geoarkeologi.id } : { [Op.and]: [{ id: geoarkeologi.id }, { userId: req.userId }] };
    
        await Geoarkeologi.update(updateData, { where: condition });
        res.status(200).json({ msg: "Data Geoarkeologi berhasil diperbaharui!" });
        
      } catch (error) {
        console.error("Error updating Geoarkeologi:", error);
        res.status(500).json({ msg: error.message });
      }
    };

export const deleteGeoarkeologi = async (req, res) => {
  try {
    const geoarkeologi = await Geoarkeologi.findOne({
      where: {
        id: req.params.uuid,
      },
    });
    if (!geoarkeologi) return res.status(404).json({ msg: "Data not found!" });
    const { title, sinopsis, deskripsilengkap, image } = req.body;
    if (req.role === "admin") {
      await Geoarkeologi.destroy({
        where: {
          id: geoarkeologi.id,
        },
      });
    } else {
      if (req.userId !== geoarkeologi.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Geoarkeologi.destroy({
        where: {
          [Op.and]: [{ id: geoarkeologi.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data Geoarkeologi berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

import News from "../../models/news/NewsModel.js";
import Users from "../../models/UserModel.js";
import { Readable } from 'stream';
// import upload from "../../middleware/multerConfig.js";
import cloudinary from "../../middleware/cloudinary.js";


export const getNews = async (req, res) => {
  try {
      const response = await News.findAll({
        attributes: [
        "id",
          "uuid",
          "author",
          "kategori",
          "tags",
          "title",
          "image",
          "content",
          "createdAt",
        ],
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
};

export const getNewsByUuid = async (req, res) => {
  try {
      const response = await News.findOne({
        attributes: [
        "id",
          "uuid",
          "author",
          "kategori",
          "tags",
          "title",
          "image",
          "content",
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


export const createNews = async (req, res) => {
  const { author, kategori, tags, title, content } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'File gambar wajib diunggah' });
    }

    // Unggah gambar ke Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'news_images' },
      async (err, result) => {
        if (err) {
          console.error("Error uploading to Cloudinary:", err);
          return res.status(500).json({ success: false, message: "Error uploading to Cloudinary" });
        }

        // Mengambil URL dari hasil unggahan Cloudinary
        const imageUrl = result.secure_url;

        // Simpan data News ke database
        await News.create({
          author: author,
          kategori: kategori,
          tags: tags,
          title: title,
          image: imageUrl,  // Menyimpan URL gambar dari Cloudinary
          content: content,
          userId: req.userDbId,
        });

        res.status(201).json({ msg: "Data News Berhasil Ditambahkan!", imageUrl: imageUrl });
      }
    );

    // Mengalirkan buffer file ke Cloudinary
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);

  } catch (error) {
    console.error("Error creating News:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const news = await News.findOne({
      where: { id: req.params.uuid },
    });
    if (!news) return res.status(404).json({ msg: "Data tidak ditemukan!" });

    const { author, kategori, tags, title, content } = req.body;
    let imageUrl = news.image;

    // Cek jika ada file gambar baru yang diunggah
    if (req.file) {
      // Hapus gambar lama dari Cloudinary
      const publicId = news.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);

      // Unggah gambar baru ke Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'news_images' },
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

    // Update data News di database
    const updateData = { author, kategori, tags, title, image: imageUrl, content };
    const condition = req.role === "admin" ? { id: news.id } : { [Op.and]: [{ id: news.id }, { userId: req.userId }] };

    await News.update(updateData, { where: condition });
    res.status(200).json({ msg: "Data News berhasil diperbaharui!" });
    
  } catch (error) {
    console.error("Error updating News:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findOne({
      where: {
        id: req.params.uuid,
      },
    });
    if (!news) return res.status(404).json({ msg: "Data not found!" });
    const { author, kategori, tags, title, image, content } = req.body;
    if (req.role === "admin") {
      await News.destroy({
        where: {
          id: news.id,
        },
      });
    } else {
      if (req.userId !== news.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await News.destroy({
        where: {
          [Op.and]: [{ id: news.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data News berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

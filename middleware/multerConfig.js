import multer from "multer";

// Simpan file di memory
const storage = multer.memoryStorage();

// Filter hanya izinkan jpg, jpeg, png
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); // ✅ diterima
  } else {
    cb(new Error("Hanya file JPG dan PNG yang diperbolehkan!"), false); // ❌ ditolak
  }
};

// Batas ukuran misal 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;

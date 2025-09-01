export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ msg: "Hanya file JPG dan PNG yang diperbolehkan!" });
    }
  }

  // fallback error lain
  return res.status(500).json({ msg: err.message || "Terjadi kesalahan server" });
};

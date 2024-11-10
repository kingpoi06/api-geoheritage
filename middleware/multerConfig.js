import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

console.log("Multer Config Loaded:", upload);

export default upload;

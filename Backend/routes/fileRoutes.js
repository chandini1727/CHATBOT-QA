const express = require("express");
const multer = require("multer");
const { uploadFiles, deleteFile, debugFiles } = require("../controllers/fileController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }).array("file", 5);

router.post("/upload", upload, uploadFiles);
router.delete("/delete", deleteFile);
router.get("/debug", debugFiles);

module.exports = router;

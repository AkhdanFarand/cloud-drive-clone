const express = require("express");
const multer = require("multer");

const authMiddleware = require("../middlewares/authMiddleware");

const {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  renameFile,
} = require("../controllers/fileController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

router.get(
  "/",
  authMiddleware,
  getFiles
);

router.get(
  "/:id/download",
  authMiddleware,
  downloadFile
);

router.patch(
  "/:id",
  authMiddleware,
  renameFile
);

router.delete(
  "/:id",
  authMiddleware,
  deleteFile
);

module.exports = router;
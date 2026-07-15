const { v4: uuidv4 } = require("uuid");
const { minioClient, bucketName } = require("../config/minio");
const File = require("../models/fileModel");

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File tidak ditemukan",
    });
  }

  const objectName = `${uuidv4()}-${req.file.originalname}`;

  minioClient.putObject(
    bucketName,
    objectName,
    req.file.buffer,
    req.file.size,
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      File.create(
        {
          user_id: req.user.id,
          original_name: req.file.originalname,
          object_name: objectName,
          file_size: req.file.size,
          mime_type: req.file.mimetype,
        },
        (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          return res.json({
            success: true,
            message: "Upload berhasil",
            fileId: result.insertId,
          });
        }
      );
    }
  );
};

const getFiles = (req, res) => {
  File.findByUserId(req.user.id, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    return res.json({
      success: true,
      files,
    });
  });
};

const downloadFile = (req, res) => {
    const fileId = req.params.id;
  
    File.findById(fileId, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
  
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "File tidak ditemukan",
        });
      }
  
      const file = results[0];
  
      // Pastikan hanya pemilik file yang boleh download
      if (file.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Akses ditolak",
        });
      }
  
      minioClient.getObject(
        bucketName,
        file.object_name,
        (err, dataStream) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }
  
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${file.original_name}"`
          );
  
          res.setHeader(
            "Content-Type",
            file.mime_type
          );
  
          dataStream.pipe(res);
        }
      );
    });
  };    

  const deleteFile = (req, res) => {
    const fileId = req.params.id;
  
    File.findById(fileId, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
  
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "File tidak ditemukan",
        });
      }
  
      const file = results[0];
  
      // Pastikan file milik user
      if (file.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Akses ditolak",
        });
      }
  
      // Hapus object di MinIO
      minioClient.removeObject(bucketName, file.object_name, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }
  
        // Hapus metadata di MySQL
        File.delete(file.id, (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }
  
          return res.json({
            success: true,
            message: "File berhasil dihapus",
          });
        });
      });
    });
  };

  const renameFile = (req, res) => {
    const fileId = req.params.id;
    const { original_name } = req.body;
  
    if (!original_name) {
      return res.status(400).json({
        success: false,
        message: "Nama file wajib diisi",
      });
    }
  
    File.findById(fileId, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
  
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "File tidak ditemukan",
        });
      }
  
      const file = results[0];
  
      if (file.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Akses ditolak",
        });
      }
  
      File.updateName(file.id, original_name, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }
  
        res.json({
          success: true,
          message: "Nama file berhasil diubah",
        });
      });
    });
  };

module.exports = {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  renameFile,
}; 
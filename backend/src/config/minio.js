const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = process.env.MINIO_BUCKET;

minioClient.bucketExists(bucketName, (err, exists) => {
  if (err) {
    console.error("❌ Gagal mengecek bucket:", err.message);
    return;
  }

  if (!exists) {
    minioClient.makeBucket(bucketName, "us-east-1", (err) => {
      if (err) {
        console.error("❌ Gagal membuat bucket:", err.message);
        return;
      }

      console.log(`✅ Bucket '${bucketName}' berhasil dibuat`);
    });
  } else {
    console.log(`✅ Bucket '${bucketName}' siap digunakan`);
  }
});

module.exports = {
  minioClient,
  bucketName,
};
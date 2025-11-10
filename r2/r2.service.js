const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  },
});

async function uploadFile(filePath, fileName, folder, mimeType) {
  const buffer = fs.readFileSync(filePath);
  const key = `${folder}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await r2.send(command);

  return `https://pub-${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.dev/${key}`;
}

module.exports = { uploadFile };

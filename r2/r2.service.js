const { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand 
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
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

  return key;
}

async function getPresignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET,
    Key: key,
  });

  return getSignedUrl(r2, command, { expiresIn: 3600 });
}

module.exports = { uploadFile, getPresignedUrl };

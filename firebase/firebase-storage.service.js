const { ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");
const { storage } = require("./firebase.config");
const fs = require("fs");

class FirebaseStorageService {
  static async uploadFile(localPath, destName, folder = "uploads") {
    try {
      const timestamp = Date.now();
      const uniqueName = `${timestamp}-${destName}`;
      const storageRef = ref(storage, `${folder}/${uniqueName}`);

      const buffer = fs.readFileSync(localPath);
      await uploadBytes(storageRef, buffer);
      const url = await getDownloadURL(storageRef);

      fs.unlinkSync(localPath);
      return url;
    } catch (error) {
      console.error("Firebase upload error:", error);
      throw error;
    }
  }

  static async deleteFile(destName, folder = "uploads") {
    try {
      const fileRef = ref(storage, `${folder}/${destName}`);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error("Firebase delete error:", error);
      throw error;
    }
  }
}

module.exports = { FirebaseStorageService };

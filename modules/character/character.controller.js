const router = require("express").Router();
const multer = require("multer");
const characterService = require("./character.service");
const { FirebaseStorageService } = require("../../firebase/firebase-storage.service");
const { verifyAdmin } = require("../../middleware/verify-admin");

const upload = multer({ dest: "uploads/" });

router.post("/",verifyAdmin, upload.array("images"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const files = req.files || [];

    const uploadedUrls = await Promise.all(
      files.map((file) =>
        FirebaseStorageService.uploadFile(file.path, file.originalname, "characters")
      )
    );

    const createdCharacter = await characterService.create({
      name,
      description,
      images: uploadedUrls,
    });

    return res.status(201).send(createdCharacter);
  } catch (error) {
    console.error("Character create error:", error);
    return res.status(500).send({ error: "Character creation failed" });
  }
});

router.get("/", async (req, res) => {
  const characters = await characterService.getAll();
  return res.send(characters);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const character = await characterService.getById(id);
  return res.send(character);
});

module.exports = router;

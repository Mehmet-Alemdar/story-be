const router = require("express").Router();
const multer = require("multer");
const storyService = require("./story.service");
const { verifyAdmin } = require("../../middleware/verify-admin");
const { verifyKey } = require("../../middleware/key-check");
const fs = require("fs");
const { uploadFile } = require("../../r2/r2.service");
const { sanitizedFileName } = require("../../lib/sanitized_file_name");

const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  verifyAdmin,
  upload.fields([
    { name: "videos", maxCount: 10 },
    { name: "image", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { name, character, type } = req.body;

      const videoFiles = req.files["videos"] || [];
      const imageFile = req.files["image"] ? req.files["image"][0] : null;

      const uploadedKeys = [];
      let uploadedImageKey = null;

      for (const file of videoFiles) {
        const key = await uploadFile(
          file.path,
          sanitizedFileName(file),
          "stories",
          file.mimetype
        );

        uploadedKeys.push(key);

        fs.unlinkSync(file.path);
      }

      if (imageFile) {
        uploadedImageKey = await uploadFile(
          imageFile.path,
          sanitizedFileName(imageFile),
          "story-images",
          imageFile.mimetype
        );

        fs.unlinkSync(imageFile.path);
      }

      // --- Story oluştur ---
      const createdStory = await storyService.create({
        name,
        character,
        type: type || "video",
        videoContent: uploadedKeys,
        image: uploadedImageKey,
      });

      res.status(201).send(createdStory);

    } catch (error) {
      console.error("Story create error:", error);
      res.status(500).send({ error: "Story creation failed" });
    }
  }
);

router.get("/", verifyKey, async (req, res) => {
  try {
    const stories = await storyService.getAll();
    res.send(stories);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch stories" });
  }
});

router.get("/:id", verifyKey, async (req, res) => {
  try {
    const { id } = req.params;
    const story = await storyService.getById(id);
    res.send(story);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch story" });
  }
});

router.get("/character/:characterId", verifyKey, async (req, res) => {
  try {
    const { characterId } = req.params;
    const stories = await storyService.getByCharacterId(characterId);
    res.send(stories);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch character stories" });
  }
});

module.exports = router;

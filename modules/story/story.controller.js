const router = require("express").Router();
const multer = require("multer");
const storyService = require("./story.service");
const { FirebaseStorageService } = require("../../firebase/firebase-storage.service");
const { verifyAdmin } = require("../../middleware/verify-admin");

const upload = multer({ dest: "uploads/" });

router.post("/", verifyAdmin, upload.array("videos"), async (req, res) => {
  try {
    const { name, character, type } = req.body;
    const files = req.files || [];

    const uploadedUrls = await Promise.all(
      files.map((file) =>
        FirebaseStorageService.uploadFile(file.path, file.originalname, "stories")
      )
    );

    const createdStory = await storyService.create({
      name,
      character,
      type: type || "video",
      videoContent: uploadedUrls,
    });

    res.status(201).send(createdStory);
  } catch (error) {
    console.error("Story create error:", error);
    res.status(500).send({ error: "Story creation failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const stories = await storyService.getAll();
    res.send(stories);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch stories" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const story = await storyService.getById(id);
    res.send(story);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch story" });
  }
});

router.get("/character/:characterId", async (req, res) => {
  try {
    const { characterId } = req.params;
    const stories = await storyService.getByCharacterId(characterId);
    res.send(stories);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch character stories" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { firebaseApp } = require("../firebase/firebase.config");

const { loginLimiter } = require("../middleware/rate-limit");

const auth = getAuth(firebaseApp);

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    res.status(200).json({
      message: "Login successful",
      uid: user.uid,
      email: user.email,
      idToken,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ error: "Invalid email or password" });
  }
});

module.exports = router;

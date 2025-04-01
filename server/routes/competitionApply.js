const express = require("express");
const multer = require("multer");

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" }); // Files will be stored in the "uploads" folder

// Initialize Router
const router = express.Router();
const CompetitionApply = require("../models/competitionApply"); // Import CompetitionApply model

// Serve static files (set this up in the main server file, NOT here)
// app.use("/uploads", express.static("uploads")); // Move this to your main app file

// Insert new submission (POST)
router.post("/submissions", upload.single("transactionSlip"), async (req, res) => {
  try {
    // Handle uploaded file and other form data
    const newSubmission = new CompetitionApply({
      ...req.body,
      transactionSlip: req.file ? req.file.filename : null, // Save file name if uploaded
    });
    await newSubmission.save(); // Save submission to the database
    res.status(201).json({ message: "Submission successful!", data: newSubmission });
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).json({ message: "Failed to save submission." });
  }
});

// Fetch all submissions (GET)
router.get("/submissions", async (req, res) => {
  try {
    const submissions = await CompetitionApply.find(); // Retrieve all submissions
    res.status(200).json(submissions); // Respond with the submission data
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ message: "Failed to fetch submissions." });
  }
});

// Debug: Log the uploaded file and body data (REMOVE after testing)
router.post("/debug", upload.single("transactionSlip"), async (req, res) => {
  console.log(req.file); // Logs the uploaded file
  console.log(req.body); // Logs other form fields
  res.status(200).json({ message: "Debug endpoint hit successfully." });
});

module.exports = router; // Export the router for use in the main app

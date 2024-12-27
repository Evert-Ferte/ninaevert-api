const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001; // Change as needed

// const corsOptions = {
//   origin: ""
// }
app.use(cors());  // enable cors

// Configure Multer to save files to the public folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/uploads")); // Save to public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Add timestamp to avoid name conflicts
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("express api is running on port " + port);
});

// Serve the website on all other paths, except the API paths
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Endpoint to handle image upload
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.status(200).send({ message: "File uploaded successfully", path: `/uploads/${req.file.filename}` });
});

app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

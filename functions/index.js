const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
admin.initializeApp();

exports.uploadFile = functions.https.onRequest(async (req, res) => {
  // Enable CORS for your frontend
  res.set("Access-Control-Allow-Origin", "http://localhost:5173");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  try {
    const file = req.body.file; // Assuming you send the file as base64 or buffer
    const fileName = req.body.name; // File name
    const bucket = storage.bucket("your-storage-bucket-name"); // Update this with your bucket name

    const fileRef = bucket.file(`reports/${fileName}`);
    await fileRef.save(file, {
      metadata: { contentType: req.body.type }, // File type (e.g., image/png)
    });

    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
    res.status(200).json({ downloadURL });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Upload failed");
  }
});

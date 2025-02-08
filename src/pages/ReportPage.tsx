import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyACAJ0Vbu1-AVGjJC8BtMsko_PCjLHyodU",
  authDomain: "innov8ers-twise.firebaseapp.com",
  projectId: "innov8ers-twise",
  storageBucket: "innov8ers-twise.appspot.com",
  messagingSenderId: "453598995757",
  appId: "1:453598995757:web:40d2be24cd2c75eab35fa4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const ReportPage: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("");
  const [recordType, setRecordType] = useState("fisherman");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Initialize Leaflet Map
    const map = L.map("map").setView([36.8, 10.2], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    let marker: L.Marker | null = null;

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker([lat, lng]).addTo(map);
      setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    });

    return () => {
      map.remove();
    };
  }, []);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location) {
      alert("Please select a location on the map.");
      return;
    }

    try {
      let imageUrl = "";
      if (selectedFile) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `reports/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Save report to Firestore
      await addDoc(collection(db, "fish_reports"), {
        date,
        wayOfRecord: recordType,
        location,
        picture: imageUrl,
      });

      alert("Sighting submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Error submitting sighting.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Report a Sighting</h1>
      <div id="map" style={{ height: "400px", borderRadius: "10px", border: "2px solid #ccc", marginBottom: "20px" }}></div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        {/* Date Input */}
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        {/* Image Upload */}
        <label htmlFor="picture">Upload Picture:</label>
        <input type="file" id="picture" accept="image/*" onChange={handleImageChange} required />
        {imagePreview && <img src={imagePreview} alt="Image Preview" style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "10px" }} />}

        {/* Location (Read-Only) */}
        <label htmlFor="location">Location:</label>
        <input type="text" id="location" value={location} readOnly />
        <small>Click on the map to select a location.</small>

        {/* Way of Record */}
        <label htmlFor="recordType">Way of Record:</label>
        <select id="recordType" value={recordType} onChange={(e) => setRecordType(e.target.value)} required>
          <option value="fisherman">Fisherman</option>
          <option value="citizen">Citizen</option>
          <option value="ngo">NGO Routine Exploration</option>
        </select>

        {/* Submit Button */}
        <button type="submit" style={{ backgroundColor: "#007bff", color: "white", padding: "10px", cursor: "pointer", border: "none", marginTop: "10px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReportPage;

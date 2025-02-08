import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import supabase from "../supabaseClient";
import imageCompression from "browser-image-compression"; // Import the library

// Define the custom icon using CDN URLs
const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ReportPage: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("");
  const [recordType, setRecordType] = useState("fisherman");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
      // Use the custom icon for the marker
      marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    });

    return () => {
      map.remove();
    };
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Compress the image
      const options = {
        maxSizeMB: 5, // Maximum size in MB
        maxWidthOrHeight: 1024, // Maximum width or height
        useWebWorker: true, // Use a web worker for better performance
      };

      try {
        const compressedFile = await imageCompression(file, options);
        setSelectedFile(compressedFile);

        // Generate a preview of the compressed image
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Failed to compress the image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Please select a location on the map.");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = "";

      if (selectedFile) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(selectedFile.type)) {
          throw new Error("Only JPG, PNG, and GIF files are allowed.");
        }
        
        if (selectedFile.size > maxSize) {
          throw new Error("File size must be less than 5MB.");
        }

        const fileName = `${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        
        const { data: _, error } = await supabase.storage
          .from("reports")
          .upload(fileName, selectedFile);

        if (error) {
          throw error;
        }

        imageUrl = `https://relhbyrygwpjseeknvzy.supabase.co/storage/v1/object/public/reports/${fileName}`;
      }

      // Use correct column names in the database query
      const sightingData = {
        date,
        way_of_record: recordType,
        location,
        picture: imageUrl,
      };

      console.log("Attempting to insert:", sightingData);

      const { error } = await supabase
        .from("fish_reports")
        .insert([sightingData]);

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      alert("Sighting submitted successfully!");
      setDate(new Date().toISOString().split("T")[0]);
      setLocation("");
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      if (error instanceof Error) {
        alert(`Error submitting sighting: ${error.message}`);
      } else {
        alert("An unknown error occurred while submitting the sighting.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", marginTop: "120px" }}>
      <h1>Report a Sighting</h1>
      <div id="map" style={{ height: "400px", borderRadius: "10px", border: "2px solid #ccc", marginBottom: "20px" }}></div>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <label htmlFor="date">Date:</label>
        <input 
          type="date" 
          id="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
          disabled={isLoading}
        />
        
        <label htmlFor="picture">Upload Picture:</label>
        <input 
          type="file" 
          id="picture" 
          accept="image/*" 
          onChange={handleImageChange} 
          disabled={isLoading}
        />
        
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Image Preview" 
            style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "10px" }}
          />
        )}
        
        <label htmlFor="location">Location:</label>
        <input 
          type="text" 
          id="location" 
          value={location} 
          readOnly 
          disabled={isLoading}
        />
        <small>Click on the map to select a location.</small>
        
        <label htmlFor="recordType">Way of Record:</label>
        <select 
          id="recordType" 
          value={recordType} 
          onChange={(e) => setRecordType(e.target.value)} 
          required 
          disabled={isLoading}
        >
          <option value="fisherman">Fisherman</option>
          <option value="citizen">Citizen</option>
          <option value="ngo">NGO Routine Exploration</option>
        </select>

        <button 
          type="submit" 
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            cursor: isLoading ? "not-allowed" : "pointer",
            border: "none",
            marginTop: "10px"
          }}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ReportPage;
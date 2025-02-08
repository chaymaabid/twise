import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import supabase from "../supabaseClient";

// Remove unused interface
// interface Sighting {
//   id: string;
//   latitude: number;
//   longitude: number;
//   date: string;
//   wayOfRecord: string;
//   picture?: string;
// }

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
      marker = L.marker([lat, lng]).addTo(map);
      setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    });

    return () => {
      map.remove();
    };
  }, []);

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
        
        const { data, error } = await supabase.storage
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
        way_of_record: recordType, // Changed from wayOfRecord
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

  const validateSightingData = (data: any): string[] => {
    const errors: string[] = [];
    
    // Check required fields
    if (!data.date) {
      errors.push("Date is required");
    }
    
    if (!data.way_of_record) {
      errors.push("Way of record is required");
    }
    
    if (!data.location) {
      errors.push("Location is required");
    }
    
    // Validate way_of_record values
    if (data.way_of_record && 
        !['fisherman', 'citizen', 'ngo'].includes(data.way_of_record)) {
      errors.push("Invalid way of record");
    }
    
    return errors;
  };

  return (
    <div style={{ padding: "20px", marginTop:"120px"}}>
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
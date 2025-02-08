import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db } from '../firebase'; // Import Firebase correctly
import { collection, getDocs } from "firebase/firestore"; // Modular Firestore functions

// Interface for sightings
interface Sighting {
  id: string;
  latitude: number;
  longitude: number;
  date: string;
  wayOfRecord: string;
}

const Decouvrir: React.FC = () => {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  // Load sightings from Firebase
  useEffect(() => {
    const fetchSightings = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "fish_reports"));
          const reports: Sighting[] = querySnapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Sighting, "id">; // Avoid duplicate "id"
            return {
              id: doc.id, // Assign Firestore document ID explicitly
              ...data, // Spread remaining data
            };
          });
      
          setSightings(reports);
        } catch (error) {
          console.error("Error loading sightings:", error);
        }
      };

    fetchSightings();
  }, [startDate, endDate, filterType]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Rabbitfish Watch</h1>

      {/* Filters */}
      <div className="filters">
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" id="startDate" onChange={(e) => setStartDate(e.target.value)} />

        <label htmlFor="endDate">End Date:</label>
        <input type="date" id="endDate" onChange={(e) => setEndDate(e.target.value)} />

        <label htmlFor="filterType">Record Type:</label>
        <select id="filterType" onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All</option>
          <option value="fisherman">Fisherman</option>
          <option value="citizen">Citizen</option>
          <option value="ngo">NGO Routine Exploration</option>
        </select>
      </div>

      {/* Map */}
      <MapContainer center={[36.8, 10.2]} zoom={6} style={{ height: "500px", width: "100%", marginTop: "20px" }}>
        <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {sightings.map((sighting) => (
          <Marker key={sighting.id} position={[sighting.latitude, sighting.longitude]}>
            <Popup>
              <b>🐟 Sighting Info:</b>
              <br />
              📅 <b>Date:</b> {sighting.date} <br />
              📍 <b>Location:</b> {sighting.latitude}, {sighting.longitude} <br />
              🎣 <b>Way of Record:</b> {sighting.wayOfRecord}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Decouvrir;

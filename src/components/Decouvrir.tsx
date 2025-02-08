import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import supabase from "../supabaseClient";

interface Sighting {
  id: string;
  latitude: number;
  longitude: number;
  date: string;
  wayOfRecord: string;
  picture?: string;
}

const Decouvrir: React.FC = () => {
  const [sightings, setSightings] = useState<Sighting[]>([]);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const { data, error } = await supabase.from("fish_reports").select("*");

        if (error) throw error;

        const formattedSightings = data.map((sighting: any) => ({
          id: sighting.id,
          latitude: parseFloat(sighting.location.split(",")[0]),
          longitude: parseFloat(sighting.location.split(",")[1]),
          date: sighting.date,
          wayOfRecord: sighting.wayOfRecord,
          picture: sighting.picture,
        }));

        setSightings(formattedSightings);
      } catch (error) {
        console.error("Error loading sightings:", error);
      }
    };

    fetchSightings();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Rabbitfish Watch</h1>

      <MapContainer center={[36.8, 10.2]} zoom={6} style={{ height: "500px", width: "100%", marginTop: "20px" }}>
        <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {sightings.map((sighting) => (
          <Marker key={sighting.id} position={[sighting.latitude, sighting.longitude]}>
            <Popup>
              <b>🐟 Sighting Info:</b>
              <br />
              📅 <b>Date:</b> {sighting.date} <br />
              📍 <b>Location:</b> {sighting.latitude}, {sighting.longitude} <br />
              🎣 <b>Way of Record:</b> {sighting.wayOfRecord} <br />
              {sighting.picture && <img src={sighting.picture} alt="Sighting" style={{ width: "100px" }} />}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Decouvrir;

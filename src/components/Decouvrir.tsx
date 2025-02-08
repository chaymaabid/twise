import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import supabase from "../supabaseClient";

const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
      <div style={{ height: "500px", width: "100%", marginTop: "20px" }}>
        <MapContainer 
          center={[36.8, 10.2]} 
          zoom={6} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {sightings.map((sighting) => (
            <Marker 
              key={sighting.id} 
              position={[sighting.latitude, sighting.longitude]}
              icon={customIcon}  // Using our custom icon here
            >
              <Popup>
                <div style={{ padding: "5px" }}>
                  <h3 style={{ margin: "0 0 10px 0" }}>🐟 Sighting Info</h3>
                  <p style={{ margin: "5px 0" }}>📅 <strong>Date:</strong> {sighting.date}</p>
                  <p style={{ margin: "5px 0" }}>📍 <strong>Location:</strong> {sighting.latitude.toFixed(4)}, {sighting.longitude.toFixed(4)}</p>
                  <p style={{ margin: "5px 0" }}>🎣 <strong>Way of Record:</strong> {sighting.wayOfRecord}</p>
                  {sighting.picture && (
                    <img 
                      src={sighting.picture} 
                      alt="Sighting" 
                      style={{ 
                        width: "100%", 
                        maxWidth: "200px", 
                        height: "auto", 
                        marginTop: "10px" 
                      }} 
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Decouvrir;
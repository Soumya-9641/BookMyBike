import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box, Typography } from "@mui/material";
import { defaultMarkerIcon } from "../utils/leafletIcon";

interface Props {
  lat: number;
  lng: number;
  address?: string;
}

const BikeLocationMap = ({ lat, lng, address }: Props) => {
  return (
    <Box mt={2}>
      <Typography fontWeight={600} mb={1}>
        Pickup Location
      </Typography>

      <Box sx={{ height: 280, borderRadius: 2, overflow: "hidden" }}>
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[lat, lng]} icon={defaultMarkerIcon}>
            <Popup>{address || "No address provided"}</Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Box>
  );
};

export default BikeLocationMap;
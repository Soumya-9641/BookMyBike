import { Autocomplete } from "@react-google-maps/api";
import { TextField } from "@mui/material";
import { useRef } from "react";

interface Props {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void; // 👈 NEW
  onSelect: (data: {
    address: string;
    lat: number;
    lng: number;
    city: string;
    country: string;
  }) => void;
}

const LocationAutocomplete = ({
  label,
  value,
  disabled = false,
  onChange,
  onSelect,
}: Props) => {
  const autocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);

  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    let city = "";
    let country = "";

    place.address_components?.forEach((comp) => {
      if (comp.types.includes("locality")) city = comp.long_name;
      if (comp.types.includes("country")) country = comp.long_name;
    });

    onSelect({
      address: place.formatted_address || "",
      lat,
      lng,
      city,
      country,
    });
  };

  return (
    <Autocomplete
      onLoad={handleLoad}
      onPlaceChanged={handlePlaceChanged}
      options={{
        componentRestrictions: { country: "se" }, // 🇸🇪 Sweden
        types: ["geocode"],
      }}
    >
      <TextField
        label={label}
        size="small"
        fullWidth
        value={value}
        disabled={disabled}          // ✅ disable support
        onChange={(e) => onChange(e.target.value)} // ✅ manual typing works
      />
    </Autocomplete>
  );
};

export default LocationAutocomplete;
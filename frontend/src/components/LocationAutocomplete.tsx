import { Autocomplete } from "@react-google-maps/api";
import { TextField } from "@mui/material";
import { memo, useCallback, useMemo, useRef } from "react";

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

const LocationAutocomplete = memo(function LocationAutocomplete({
  label,
  value,
  disabled = false,
  onChange,
  onSelect,
}: Props) {
  const autocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);

  const handleLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    let city = "";
    let country = "";

    place.address_components?.forEach((comp) => {
      if (comp.types.includes("locality")) {
        city = comp.long_name;
      } else if (!city && comp.types.includes("administrative_area_level_3")) {
        city = comp.long_name;
      } else if (!city && comp.types.includes("sublocality_level_1")) {
        city = comp.long_name;
      }

      if (comp.types.includes("country")) {
        country = comp.long_name;
      }
    });

    onSelect({
      address: place.formatted_address || "",
      lat,
      lng,
      city,
      country,
    });
  }, [onSelect]);

  const autocompleteOptions = useMemo(
    () => ({
      componentRestrictions: { country: "se" },
      types: ["geocode"],
    }),
    [],
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );

  return (
    <Autocomplete
      onLoad={handleLoad}
      onPlaceChanged={handlePlaceChanged}
      options={autocompleteOptions}
    >
      <TextField
        label={label}
        size="small"
        fullWidth
        value={value}
        disabled={disabled}
        onChange={handleTextChange}
      />
    </Autocomplete>
  );
});

export default LocationAutocomplete;
export const BIKE_CATEGORIES = {
  Urban: [
    "City",
    "Commuter",
    "Dutch",
    "Hybrid",
    "Trekking",
    "Fitness",
    "Folding",
    "Compact / Mini",
    "Single speed",
  ],

  "Road & Performance": [
    "Road",
    "Endurance",
    "Racing",
    "Triathlon",
    "Gravel",
    "Cyclocross",
  ],

  "Mountain & Off-Road": [
    "Hardtail",
    "Full Suspension",
    "Cross-Country (XC)",
    "Trail",
    "Enduro",
    "Downhill (DH)",
    "Fat Bike",
  ],

  Electric: [
    "Electric (E-Bike)",
    "Electric City",
    "Electric Hybrid",
    "Electric Mountain",
    "Electric Road",
    "Electric Gravel",
    "Electric Folding",
    "Electric Cargo",
    "Speed Pedelec",
  ],

  "Cargo & Utility": [
    "Longtail",
    "Front-Load Cargo",
    "Utility",
    "Delivery / Commercial",
  ],

  "Children’s": [
    "Balance",
    "Youth",
    "Mountain bike",
    "Hybrid",
    "Tricycle",
  ],
} as const;

export const VITE_STRIPE_PUBLISHABLE_KEY="pk_live_51SzNosFUhtek91M3q0sg8ThSGqItJ2z7p8Ehm0NmWsmaeGdhOI1nvaxPglsGG9mYhxZlGqojtCMX3wcWqFM5XAk800GDTyMzPc";

export const VITE_GOOGLE_MAPS_API_KEY="AIzaSyAJG-R81cH4goveRZ6Bl3O_J_0vjR_6bIQ";


export const statusColorMap: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  upcoming: "info",
  in_progress: "warning",
  inprogress: "warning",
  completed: "success",
  refunded: "error",
  pending: "warning",
  paid: "success",
  succeeded: "success",
};

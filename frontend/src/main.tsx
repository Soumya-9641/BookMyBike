import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LoadScript } from '@react-google-maps/api';
import { VITE_GOOGLE_MAPS_API_KEY } from './constant/bikecategories.ts';
const GOOGLE_LIBRARIES: (
  | "places"
)[] = ["places"];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <LoadScript
            googleMapsApiKey={VITE_GOOGLE_MAPS_API_KEY}
            libraries={GOOGLE_LIBRARIES}
          >
            <App />
          </LoadScript>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)

import "@/styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { LicenseInfo } from "@mui/x-license";
import { BookingProvider } from "../context/BookingContext";
import { UserProvider } from "@auth0/nextjs-auth0/client";

LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_X_LICENSE_KEY);

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <BookingProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Component {...pageProps} />
        </LocalizationProvider>
      </BookingProvider>
    </UserProvider>
  );
}

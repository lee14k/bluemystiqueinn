import "@/styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { LicenseInfo } from "@mui/x-license";
import { BookingProvider } from "../context/BookingContext";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { isMobileUserAgent } from '../utils/detectMobile';


LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_X_LICENSE_KEY);

function App({ Component, pageProps, isMobile }) {
  return (
    <BookingProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <UserProvider loginUrl="/api/auth/login">
          <Component {...pageProps} isMobile={isMobile} />
        </UserProvider>
      </LocalizationProvider>
    </BookingProvider>
  );
}

App.getInitialProps = async ({ ctx }) => {
  const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;
  const isMobile = isMobileUserAgent(userAgent);
  return { isMobile };
};

export default App;
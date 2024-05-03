import "@/styles/globals.css";
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
export default function App({ Component, pageProps }) {
  return     <LocalizationProvider dateAdapter={AdapterDayjs}>
  <Component {...pageProps} /> </LocalizationProvider>  
}

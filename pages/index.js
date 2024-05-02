import Image from "next/image";
import { Inter } from "next/font/google";
import Calendar from "../components/Calendar";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
   <div>
    <Calendar/>
   </div>
  );
}

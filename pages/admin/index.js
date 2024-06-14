import MainScreen from '@/components/AdminDash/MainScreen';
import AdminNav from '@/components/AdminDash/AdminNav';
import Navbar from '@/components/FrontEnd/Navbar';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function AdminHome() {
  const { user, loading } = useUser();

    return (
     <div>
            <Navbar/>

      <AdminNav/>
     </div>
    );
  }
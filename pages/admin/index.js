import MainScreen from '@/components/AdminDash/MainScreen';
import AdminNav from '@/components/AdminDash/AdminNav';
import Navbar from '@/components/FrontEnd/Navbar';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function AdminHome() {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
    return (
     <div>
            <Navbar/>

      <AdminNav/>
     </div>
    );
  }
import MainScreen from "@/components/AdminDash/MainScreen";
import AdminNav from "@/components/AdminDash/AdminNav";
import Navbar from "@/components/FrontEnd/Navbar";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import AdminCalendar from "@/components/AdminDash/AdminCalendar";

function Admin() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    // Optional: Redirect to login page if not authenticated
    router.push("/api/auth/login");
    return null;
  }

  return (
    <div>
      <Navbar />
      <AdminNav />
      <MainScreen />
      <AdminCalendar />
    </div>
  );
}

export default Admin

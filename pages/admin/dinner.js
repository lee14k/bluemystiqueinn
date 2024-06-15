import AdminNav from "../../components/AdminDash/AdminNav";
import ReservationsPageFill from "../../components/AdminDash/ReservationsPageFill";
import Navbar from "@/components/FrontEnd/Navbar";
import DinnerTable from "@/components/AdminDash/DinnerTable";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const Dinner=()=> {
  return (
    <div>
      <Navbar />
      <AdminNav />
      <DinnerTable />
    </div>
  );
}

export default withPageAuthRequired(AdminHome);
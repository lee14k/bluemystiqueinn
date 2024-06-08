import AdminNav from '../../components/AdminDash/AdminNav';
import ReservationsPageFill from '../../components/AdminDash/ReservationsPageFill';
import Navbar from '@/components/FrontEnd/Navbar';

export default function AdminHome() {
    return (
     <div>
            <Navbar/>
      <AdminNav/>
      <ReservationsPageFill/>
     </div>
    );
  }
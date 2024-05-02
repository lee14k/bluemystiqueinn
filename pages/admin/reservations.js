import ReservationList from '../../components/AdminDash/ReservationList';
import AdminCalendar from '../../components/AdminDash/AdminCalendar';
import AdminNav from '../../components/AdminDash/AdminNav';
import ReservationPageFill from '../../components/AdminDash/ReservationPageFill';
export default function AdminHome() {
    return (
     <div>
      <AdminNav/>
      <ReservationPageFill/>
     </div>
    );
  }
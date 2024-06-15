import AdminBlockDates from '@/components/AdminDash/AdminBlockDates';
import AdminNav from '../../components/AdminDash/AdminNav';
import ReservationsPageFill from '../../components/AdminDash/ReservationsPageFill';
import Navbar from '@/components/FrontEnd/Navbar';
import DateBlockCalendar from '@/components/AdminDash/DateBlockCalendar';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
const Blocker=()=> {
    return (
     <div>
            <Navbar/>
            <AdminNav/>
      <AdminBlockDates/>
      <ReservationsPageFill/>
      <DateBlockCalendar/>
     </div>
    );
  }

  export default withPageAuthRequired(Blocker);
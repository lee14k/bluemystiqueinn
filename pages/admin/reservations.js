import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import AdminNav from '../../components/AdminDash/AdminNav';
import ReservationsPageFill from '../../components/AdminDash/ReservationsPageFill';
import Navbar from '@/components/FrontEnd/Navbar';

const Reservations=()=> {
    return (
     <div>
            <Navbar/>
      <AdminNav/>
      <ReservationsPageFill/>
     </div>
    );
  }

  export default withPageAuthRequired(Reservations);
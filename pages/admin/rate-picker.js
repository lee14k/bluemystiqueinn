import AdminNav from '@/components/AdminDash/AdminNav';
import Navbar from '@/components/FrontEnd/Navbar';
import ScheduleRateChangeForm from '@/components/AdminDash/ScheduleRateChangeForm';



export default function ratePicker () {
    return (
        <div>
            <Navbar />
            <AdminNav />
            <h1>Rate Picker</h1>
          <ScheduleRateChangeForm />
        </div>
    );
}
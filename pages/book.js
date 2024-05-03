import BookingForm from "@/components/BookingForm"
import Navbar from "@/components/Navbar"
export default function Book () {
    return (
        <div>
                <Navbar/>

            <h1>Book your Stay</h1>
            <p>We’re so happy to have you! Book your stay here.
Questions? Send Us a Message.</p>
<BookingForm/>
        </div>
    )
}
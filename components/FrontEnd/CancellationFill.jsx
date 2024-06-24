import { Della_Respira } from "next/font/google";
const della = Della_Respira({ subsets: ["latin"], weight: "400" });
export default function CancellationFill() {
  return (
    <div className={`${della.className} flex flex-col gap-16`}>
      <h1 className="text-6xl">Cancellation Policy</h1>
      <h2 className="text-4xl">Full Refund Period</h2>
      <p className="text-xl">
        14 Days Prior to Check-In: You may cancel your reservation up to 14 days
        before your check-in date for a full refund, minus a $15 fee to cover
        credit card processing costs.
      </p>

      <h2 className="text-4xl">Rebooking Option</h2>
      <p className="text-xl">
        Within 14 Days of Check-In: If you cancel your reservation within 14
        days of your check-in date, no refund will be issued. However, you are
        welcome to rebook your stay for a different date at no additional
        charge. This option allows you to change your reservation to another
        available date without incurring any penalties. We understand that plans
        can change, and we strive to accommodate our guests as best as possible
        within these guidelines. If you need to cancel or rebook, please contact
        our reservation team for assistance.
      </p>
    </div>
  );
}

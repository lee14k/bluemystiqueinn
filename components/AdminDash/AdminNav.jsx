import Link from "next/link";

const AdminNav = () => {
  return (
    <nav className="admin-nav flex justify-center items-center">
      <ul className="flex gap-24">
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/">Dashboard</Link>
        </li>
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/reservations">Reservations</Link>
        </li>
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/dinner">Dinners</Link>
        </li>
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/blocker">Blocker</Link>
        </li>
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/blocker">Add Manual Booking</Link>
        </li>
      </ul>
    </nav>
  );
};
export default AdminNav;

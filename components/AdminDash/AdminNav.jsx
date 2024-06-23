import Link from "next/link";

const AdminNav = () => {
  return (
    <nav className="admin-nav flex justify-center items-center">
      <ul className="grid lg:grid-cols-2 gap-24">
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/">Dashboard</Link>
        </li>
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/reservations">Reservation List</Link>
        </li>
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/dinner">Dinner List</Link>
        </li>
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/blocker">Date Blocker</Link>
        </li>
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/edit-reservation">Edit Reservation</Link>
        </li>
        <li className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
          <Link href="/admin/rate-picker">Edit Rates</Link>
        </li>
      </ul>
    </nav>
  );
};
export default AdminNav;

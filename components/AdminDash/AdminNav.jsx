import Link from 'next/link';

const AdminNav = () => {
    return (
        <nav className="admin-nav">
        <ul>
            <li>
            <Link href="/admin/">Dashboard</Link>
            </li>
            <li>
            <Link href="/admin/reservations">Reservations</Link>
            </li>
            <li>
            <Link href="/admin/blocker">Take time off</Link>
            </li>
        </ul>
        </nav>
    );
    }
export default AdminNav;
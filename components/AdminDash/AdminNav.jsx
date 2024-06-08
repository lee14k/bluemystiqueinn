const AdminNav = () => {
    return (
        <nav className="admin-nav">
        <ul>
            <li>
            <Link to="/admin/">Dashboard</Link>
            </li>
            <li>
            <Link to="/admin/ReservationsPageFill">Reservations</Link>
            </li>
        </ul>
        </nav>
    );
    }
export default AdminNav;
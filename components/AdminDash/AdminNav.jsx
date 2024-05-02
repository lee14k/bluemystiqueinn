const AdminNav = () => {
    return (
        <nav className="admin-nav">
        <ul>
            <li>
            <Link to="/admin/">Dashboard</Link>
            </li>
            <li>
            <Link to="/admin/products">Reservations</Link>
            </li>
            <li>
            <Link to="/admin/orders">Availability</Link>
            </li>
            <li>
            <Link to="/admin/orders">Analytics</Link>
            </li>
        </ul>
        </nav>
    );
    }
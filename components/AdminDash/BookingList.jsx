// components/BookingsTable.js
import { useEffect, useState } from "react";

const BookingList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/adminDisplay");
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error);
        }
        setData(result);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div>
      <h1>Bookings</h1>
      <table>
        <thead>
          <tr>
            {/* Replace with your actual column names */}
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Start Date
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              End Date
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Room Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Guest Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Guest Email
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {/* Replace with your actual column names */}
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {formatDate(item.start_date)}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {formatDate(item.end_date)}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.room_name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.first_name} {item.last_name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;

// components/BookingsTable.js
import { useEffect, useState } from "react";

const DinnerTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/adminFoodDisplay");
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

  return (
    <div>
      <h1>Dinners</h1>
      <table>
        <thead>
          <tr>
            {/* Replace with your actual column names */}
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Booking Number
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Guest Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Allergies
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Preferences
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Special Occasion
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Dinner Times
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {/* Replace with your actual column names */}
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.booking_id}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.guest_name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.allergies}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.preferences}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.special_occasion}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.dinner_time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DinnerTable;

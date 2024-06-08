// components/BookingsTable.js
import { useEffect, useState } from 'react';

const BookingList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bookings');
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
      <h1>Bookings Table Data</h1>
      <table>
        <thead>
          <tr>
            {/* Replace with your actual column names */}
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {/* Replace with your actual column names */}
              <td>{item.column1}</td>
              <td>{item.column2}</td>
              <td>{item.column3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;

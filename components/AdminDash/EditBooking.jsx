import { useState, useEffect } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

const EditBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingCell, setEditingCell] = useState({ row: null, column: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const [changedFields, setChangedFields] = useState({});

  const columns = ["first_name", "last_name", "start_date", "end_date", "phone_number", "email", "room_name", "dinner"];

  useEffect(() => {
    const fetchBookings = async () => {
      const response = await fetch("/api/get-bookings");
      const data = await response.json();
      setBookings(data);
    };

    fetchBookings();
  }, []);

  const handleCellClick = (row, column) => {
    setEditingCell({ row, column });
    setTempValue(bookings[row][column] || ""); // Handle empty cells
  };

  const handleChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleUpdateClick = () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    const { row, column } = editingCell;

    // Track the changed field
    const updatedBookings = bookings.map((booking, index) =>
      index === row ? { ...booking, [column]: tempValue } : booking
    );
    setBookings(updatedBookings);
    setShowModal(false);
    setEditingCell({ row: null, column: null });
    setLoading(true);
    setMessage("");

    try {
      console.log("Sending update request with booking data:", {
        bookingId: bookings[row].id,
        bookingData: { [column]: tempValue },
      });

      const response = await fetch("/api/update-booking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookings[row].id,
          bookingData: { [column]: tempValue },
        }),
      });

      const result = await response.json();
      console.log("Update response", result);

      if (response.ok) {
        setMessage("Booking updated successfully!");
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating booking", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingCell({ row: null, column: null });
    setTempValue("");
  };

  return (
    <div>
      <h2>Edit Bookings</h2>
      {bookings.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>First Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Last Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Start Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>End Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Phone Number</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Room Number</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Dinner?</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, rowIndex) => (
              <tr key={booking.id}>
                {columns.map((column) => (
                  <td
                    key={column}
                    style={{ border: "1px solid #ddd", padding: "8px", position: "relative" }}
                  >
                    {editingCell.row === rowIndex && editingCell.column === column ? (
                      <div>
                        <input
                          type={column.includes("date") ? "date" : "text"}
                          value={tempValue}
                          onChange={handleChange}
                          autoFocus
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleUpdateClick}
                          sx={{ marginLeft: 2 }}
                        >
                          Update Now
                        </Button>
                      </div>
                    ) : (
                      <span onClick={() => handleCellClick(rowIndex, column)}>
                        {booking[column] || "N/A"} {/* Handle empty cells */}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {loading && <p>Updating...</p>}
      {message && <p>{message}</p>}

      <Modal
        open={showModal}
        onClose={handleCancel}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Confirm Change
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Are you sure you want to change this value?
          </Typography>
          <Button onClick={handleConfirm} sx={{ mt: 2 }}>
            Yes
          </Button>
          <Button onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>
            No
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default EditBookings;

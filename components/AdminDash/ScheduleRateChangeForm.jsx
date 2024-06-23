import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";

const ScheduleRateChangeForm = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rates, setRates] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase.from("rooms").select("id, room_name, second_name, rate");
      if (error) {
        console.error("Error fetching rooms:", error);
      } else {
        setRooms(data);
        setRates(data.map(room => room.rate)); // Set initial rates from room data
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleRateChange = (index, value) => {
    const newRates = [...rates];
    newRates[index] = value;
    setRates(newRates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inserts = rooms.map((room, index) => ({
      room_id: room.id,
      start_date: startDate,
      end_date: endDate,
      rate: rates[index]
    }));

    const { data, error } = await supabase.from("rate_picker").insert(inserts);

    if (error) {
      console.error("Error scheduling rate change:", error);
    } else {
      alert("Rate change scheduled successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="date" onChange={(e) => setStartDate(e.target.value)} required />
      <input type="date" onChange={(e) => setEndDate(e.target.value)} required />
      {rooms.map((room, index) => (
        <div key={room.id}>
          <label>
            {room.second_name}:
            <input
              type="number"
              step="0.01"
              value={rates[index]}
              onChange={(e) => handleRateChange(index, e.target.value)}
              placeholder="Rate"
              required
            />
          </label>
        </div>
      ))}
      <button type="submit">Schedule Rate Change</button>
    </form>
  );
};

export default ScheduleRateChangeForm;

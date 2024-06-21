// DinnerModal.js

import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const DinnerModal = ({ open, onClose, onYes }) => {
  const [dinnerDetails, setDinnerDetails] = useState({
    allergies: "",
    preferences: "",
    specialOccasion: "",
    time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDinnerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleYes = () => {
    onYes(dinnerDetails);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-20">
        <h2 className="text-2xl mb-4">
          Would you like dinner with your reservation?
        </h2>
        <h3>$100 per person. 3 to 6 course Chef's Table experience.</h3>
        <TextField
          label="Allergies"
          name="allergies"
          value={dinnerDetails.allergies}
          onChange={handleChange}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Preferences"
          name="preferences"
          value={dinnerDetails.preferences}
          onChange={handleChange}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Special Occasion"
          name="specialOccasion"
          value={dinnerDetails.specialOccasion}
          onChange={handleChange}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Dinner Time"
          name="time"
          value={dinnerDetails.time}
          onChange={handleChange}
          fullWidth
          className="mb-4"
        />
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="contained" color="secondary">
            No
          </Button>
          <Button onClick={handleYes} variant="contained" color="primary">
            Yes
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DinnerModal;

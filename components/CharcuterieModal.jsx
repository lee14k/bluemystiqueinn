// DinnerModal.js

import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const CharcuterieModal = ({ open, onClose, onYes }) => {
  const [CharcuterieDetails, setDinnerDetails] = useState({
    allergies: "",
    preferences: "",
    specialOccasion: "",
    time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharcuterieDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleYes = () => {
    onYes(CharcuterieDetails);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-20">
        <h2 className="text-2xl mb-4">
          Would you like a charcuterie board with your reservation?
        </h2>
        <TextField
          label="Allergies"
          name="allergies"
          value={CharcuterieDetails.allergies}
          onChange={handleChange}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Preferences"
          name="preferences"
          value={CharcuterieDetails.preferences}
          onChange={handleChange}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Special Occasion"
          name="specialOccasion"
          value={CharcuterieDetails.specialOccasion}
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

export default CharcuterieModal;

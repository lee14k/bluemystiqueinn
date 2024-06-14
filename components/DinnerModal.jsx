import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const DinnerModal = ({ open, onClose, onYes }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-20">
        <h2 className="text-2xl mb-4">Would you like dinner with your reservation?</h2>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="contained" color="secondary">No</Button>
          <Button onClick={onYes} variant="contained" color="primary">Yes</Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DinnerModal;

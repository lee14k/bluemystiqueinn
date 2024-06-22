import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const ValidationErrorModal = ({ open, onClose, errors }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Form Validation Errors
        </Typography>
        <ul>
          {Object.keys(errors).map((errorKey) => (
            <li key={errorKey}>
              <Typography variant="body1" color="error">
                {errors[errorKey]}
              </Typography>
            </li>
          ))}
        </ul>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ValidationErrorModal;

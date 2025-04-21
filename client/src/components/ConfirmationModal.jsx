import React from "react";

import Fade from "@mui/material/Fade";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
}) {
  return (
    <Modal
      open={open}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      disableEscapeKeyDown
    >
      <Fade in={open}>
        <Card
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 450,
            width: "100%",
          }}
        >
          <Typography variant="h6" gutterBottom align="center">
            {title}
          </Typography>
          <Typography variant="body1" gutterBottom align="center">
            {description}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <Button
              variant="outlined"
              style={{ width: "50%" }}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              style={{ width: "50%" }}
              onClick={onConfirm}
            >
              Confirmar
            </Button>
          </div>
        </Card>
      </Fade>
    </Modal>
  );
}

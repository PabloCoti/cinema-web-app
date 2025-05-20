import { useLocation, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function ReservationQR() {
  const location = useLocation();
  const navigate = useNavigate();
  const qrUrl = location.state?.qrUrl;

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "boleto_qr.png";
    link.click();
  };

  if (!qrUrl) {
    navigate("/");
    return null;
  }

  return (
    <Box maxWidth="sm" mx="auto" my={8}>
      <DialogTitle>¡Reservación exitosa!</DialogTitle>
      <DialogContent>
        <Typography>Presenta este QR en la entrada del cine.</Typography>
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <img
            src={qrUrl}
            alt="QR Boleto"
            style={{ width: 200, height: 200 }}
          />
          <Button sx={{ mt: 2 }} variant="outlined" onClick={handleDownloadQR}>
            Descargar QR
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
        <Button onClick={() => navigate("/reservations")}>
          Ver mis reservaciones
        </Button>
        <Button onClick={() => navigate("/")}>Ir a inicio</Button>
      </DialogActions>
    </Box>
  );
}

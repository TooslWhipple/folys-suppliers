"use client";

import { useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { Close, InsertDriveFileOutlined } from "@mui/icons-material";

export interface FacturaFormData {
  subtotal: string;
  iva: string;
  total: string;
  pdfFile: File | null;
  xmlFile: File | null;
  pdfUrl?: string | null;
  xmlUrl?: string | null;
}

interface AddFacturaDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FacturaFormData) => void;
}

export function AddFacturaDrawer({ open, onClose, onSubmit }: AddFacturaDrawerProps) {
  const [subtotal, setSubtotal] = useState("");
  const [iva, setIva] = useState("");
  const [total, setTotal] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const xmlInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    onSubmit({ subtotal, iva, total, pdfFile, xmlFile });
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setSubtotal("");
    setIva("");
    setTotal("");
    setPdfFile(null);
    setXmlFile(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.5,
      fontSize: "0.875rem",
      "& fieldset": { borderColor: "#d0d5dd" },
      "&:hover fieldset": { borderColor: "#98a2b3" },
      "&.Mui-focused fieldset": { borderColor: "#1570EF" },
    },
    "& input::placeholder": { color: "#98a2b3", opacity: 1 },
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ display: "flex", alignItems: "stretch", justifyContent: "flex-end" }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100vw", sm: 420 },
          minHeight: "100vh",
          borderRadius: 0,
          borderTopLeftRadius: { xs: 0, sm: 16 },
          borderBottomLeftRadius: { xs: 0, sm: 16 },
          outline: "none",
          boxShadow: "-8px 0px 40px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            pt: 3,
            pb: 2.5,
            borderBottom: "1px solid #f2f4f7",
          }}
        >
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              border: "1px solid #e4e7ec",
              borderRadius: 1.5,
              width: 32,
              height: 32,
              color: "#667085",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            <Close sx={{ fontSize: 16 }} />
          </IconButton>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#1570EF",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              px: 2.5,
              py: 0.875,
              borderRadius: 1.5,
              boxShadow: "none",
              "&:hover": { bgcolor: "#1462d4", boxShadow: "none" },
            }}
          >
            Agregar
          </Button>
        </Box>

        {/* Body */}
        <Box sx={{ flex: 1, px: 3, py: 3, overflowY: "auto" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.125rem", color: "#101828", mb: 3 }}>
            Agregar factura
          </Typography>

          {/* Subtotal */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#344054", mb: 0.75 }}>
              Subtotal
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Ingrese"
              value={subtotal}
              onChange={e => setSubtotal(e.target.value)}
              sx={inputSx}
            />
          </Box>

          {/* IVA */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#344054", mb: 0.75 }}>
              IVA
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Ingrese"
              value={iva}
              onChange={e => setIva(e.target.value)}
              sx={inputSx}
            />
          </Box>

          {/* Total */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#344054", mb: 0.75 }}>
              Total
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Ingrese"
              value={total}
              onChange={e => setTotal(e.target.value)}
              sx={inputSx}
            />
          </Box>

          {/* Archivos */}
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#344054", mb: 1.5 }}>
            Archivos
          </Typography>

          {/* PDF upload */}
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={e => setPdfFile(e.target.files?.[0] ?? null)}
          />
          <Box
            onClick={() => pdfInputRef.current?.click()}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              py: 2.5,
              mb: 1.5,
              border: "1.5px dashed #84CAFF",
              borderRadius: 2,
              bgcolor: "#F5FBFF",
              cursor: "pointer",
              "&:hover": { bgcolor: "#EFF8FF" },
              transition: "background-color 0.15s",
            }}
          >
            <InsertDriveFileOutlined sx={{ fontSize: 24, color: "#1570EF" }} />
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#1570EF" }}>
              {pdfFile ? pdfFile.name : "Agregar factura (PDF)"}
            </Typography>
          </Box>

          {/* XML upload */}
          <input
            ref={xmlInputRef}
            type="file"
            accept=".xml"
            style={{ display: "none" }}
            onChange={e => setXmlFile(e.target.files?.[0] ?? null)}
          />
          <Box
            onClick={() => xmlInputRef.current?.click()}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              py: 2.5,
              border: "1.5px dashed #84CAFF",
              borderRadius: 2,
              bgcolor: "#F5FBFF",
              cursor: "pointer",
              "&:hover": { bgcolor: "#EFF8FF" },
              transition: "background-color 0.15s",
            }}
          >
            <InsertDriveFileOutlined sx={{ fontSize: 24, color: "#1570EF" }} />
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#1570EF" }}>
              {xmlFile ? xmlFile.name : "Agregar factura (XML)"}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
}

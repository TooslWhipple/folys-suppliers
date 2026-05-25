"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useSupplierAuth } from "@/hooks/useSupplierAuth";
import {
  PageContainer,
  LeftPanel,
  RightPanel,
  FormWrapper,
  LogoContainer,
  Form,
  RecoveryRow,
  RecoveryLink,
} from "@/styles/login/styles";

export default function LoginPage() {
  const { login, isLoading, error } = useSupplierAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const trimmedEmail = email.trim();
  const isValidPassword = password.length >= 8;
  const passwordError = password && !isValidPassword ? "La contraseña debe tener al menos 8 caracteres" : "";
  const canSubmit = trimmedEmail.length > 0 && isValidPassword;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    await login(trimmedEmail, password);
  };

  return (
    <PageContainer>
      <LeftPanel />
      <RightPanel>
        <LogoContainer>
          <Image
            src="/logo/foly-login.svg"
            alt="foly"
            width={44}
            height={24}
            priority
            unoptimized
          />
        </LogoContainer>
        <FormWrapper>
          <Typography variant="h1">Ingresa a tu cuenta</Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <TextField
              label="Correo electrónico *"
              placeholder="Ingresa tu correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              autoComplete="email"
              autoFocus
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Contraseña *"
              placeholder="Ingresa tu contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              fullWidth
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading || !canSubmit}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Ingresar"}
            </Button>
          </Form>

          <RecoveryRow>
            <Typography variant="body2" color="text.secondary">
              ¿Problemas para acceder?
            </Typography>
            <RecoveryLink href="mailto:soporte@folysoft.com">
              Contactar soporte
            </RecoveryLink>
          </RecoveryRow>
        </FormWrapper>
      </RightPanel>
    </PageContainer>
  );
}

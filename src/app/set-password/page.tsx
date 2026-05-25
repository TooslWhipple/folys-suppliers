"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
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
} from "@/styles/login/styles";
import Image from "next/image";

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inviteToken = searchParams.get("token") ?? "";
  const { setPassword, isLoading, error } = useSupplierAuth();
  const [password, setPasswordValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isValidPassword = password.length >= 8;
  const passwordsMatch = password === confirm;
  const passwordError = password && !isValidPassword ? "La contraseña debe tener al menos 8 caracteres" : "";
  const confirmError = confirm && !passwordsMatch ? "Las contraseñas no coinciden" : "";
  const canSubmit = !!inviteToken && isValidPassword && passwordsMatch && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    await setPassword(inviteToken, password);
  };

  if (!inviteToken) {
    return (
      <PageContainer>
        <LeftPanel />
        <RightPanel>
          <FormWrapper>
            <Alert severity="error" sx={{ width: "100%" }}>
              Token de invitación no válido. Por favor solicita una nueva invitación.
            </Alert>
            <Button variant="text" onClick={() => router.push("/login")}>
              Ir al inicio de sesión
            </Button>
          </FormWrapper>
        </RightPanel>
      </PageContainer>
    );
  }

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
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography variant="h1" gutterBottom>
              Crea tu contraseña
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Elige una contraseña segura para acceder al portal.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <TextField
              label="Nueva contraseña *"
              placeholder="Mínimo 8 caracteres"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPasswordValue(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              fullWidth
              autoComplete="new-password"
              autoFocus
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

            <TextField
              label="Confirmar contraseña *"
              placeholder="Repite tu contraseña"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={!!confirmError}
              helperText={confirmError}
              fullWidth
              autoComplete="new-password"
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
                        onClick={() => setShowConfirm(!showConfirm)}
                        edge="end"
                        size="small"
                        aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
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
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Guardar contraseña"}
            </Button>
          </Form>
        </FormWrapper>
      </RightPanel>
    </PageContainer>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense>
      <SetPasswordForm />
    </Suspense>
  );
}

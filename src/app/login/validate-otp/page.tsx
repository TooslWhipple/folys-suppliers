"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Alert,
  Button,
  CircularProgress,
  InputAdornment,
  Typography,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Pin as PinIcon } from "@mui/icons-material";
import {
  useSupplierAuth,
  OTP_TOO_MANY_ATTEMPTS_STATUS,
} from "@/hooks/useSupplierAuth";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api/client";
import {
  PageContainer,
  LeftPanel,
  RightPanel,
  LogoContainer,
  FormWrapper,
  Form,
  StyledTextField,
  BackLink,
  RecoveryRow,
} from "@/styles/login/styles";

const OTP_LENGTH = 6;
const OTP_REGEX = /^\d{6}$/;

export default function ValidateOtpPage() {
  const router = useRouter();
  const {
    pendingEmail,
    isAuthenticated,
    validateOtp,
    isLoading,
    error,
    clearError,
  } = useSupplierAuth();

  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const otpTrimmed = otp.replace(/\D/g, "").slice(0, OTP_LENGTH);
  const isValidOtp = OTP_REGEX.test(otpTrimmed);
  // Agotados los intentos, el código vigente ya no se evalúa aunque sea el
  // bueno: insistir solo devuelve otro 429, hay que pedir uno nuevo.
  const attemptsExhausted = error?.status === OTP_TOO_MANY_ATTEMPTS_STATUS;
  const canSubmit = isValidOtp && !isLoading && !attemptsExhausted;

  // Sin correo pendiente no hay nada que validar: el back resuelve el OTP por
  // el proveedor, no por el navegador. Se vuelve al login a pedir uno nuevo.
  useEffect(() => {
    if (!pendingEmail && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, pendingEmail, router]);

  const handleBackToLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setResendError(null);
    setResendSuccess(false);
    await validateOtp(otpTrimmed);
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResendError(null);
    setResendSuccess(false);
    setResendLoading(true);
    try {
      await authService.resendOtp(pendingEmail);
      // El código nuevo estrena intentos: se limpia el 429 del anterior.
      clearError();
      setOtp("");
      setResendSuccess(true);
    } catch (err) {
      setResendError(getErrorMessage(err) || "No se pudo reenviar el código.");
    } finally {
      setResendLoading(false);
    }
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
          <Typography variant="h1">Verifica tu cuenta</Typography>

          <BackLink href="/login" onClick={handleBackToLogin}>
            <ArrowBackIcon fontSize="small" />
            Volver al inicio de sesión
          </BackLink>

          <Form onSubmit={handleSubmit}>
            <StyledTextField
              label="Código de verificación *"
              placeholder="Ingresa el código de 6 dígitos"
              type="text"
              inputMode="numeric"
              value={otpTrimmed}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              error={otp.length > 0 && !isValidOtp}
              helperText={
                otp.length > 0 && !isValidOtp
                  ? `Ingresa ${OTP_LENGTH} dígitos`
                  : "Revisa el correo que enviamos a tu cuenta"
              }
              fullWidth
              autoComplete="one-time-code"
              autoFocus
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PinIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {error && (
              <Alert severity={attemptsExhausted ? "warning" : "error"}>
                {attemptsExhausted
                  ? `${error.message} Usa "Reenviar" para recibir uno nuevo.`
                  : error.message}
              </Alert>
            )}
            {resendError && <Alert severity="error">{resendError}</Alert>}
            {resendSuccess && (
              <Alert severity="success">Te enviamos un nuevo código.</Alert>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={!canSubmit}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Validar"}
            </Button>
          </Form>

          <RecoveryRow>
            <Typography variant="body2" color="text.secondary">
              ¿No recibiste el código?
            </Typography>
            <Button
              variant="text"
              type="button"
              onClick={handleResend}
              disabled={resendLoading || !pendingEmail}
            >
              {resendLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Reenviar"
              )}
            </Button>
          </RecoveryRow>
        </FormWrapper>
      </RightPanel>
    </PageContainer>
  );
}

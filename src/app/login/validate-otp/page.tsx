"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Alert,
  Button,
  CircularProgress,
  InputAdornment,
  Typography,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Pin as PinIcon } from "@mui/icons-material";
import { useSupplierAuth } from "@/hooks/useSupplierAuth";
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

function ValidateOtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const { validateOtp, isLoading, error, setError } = useSupplierAuth();

  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const otpTrimmed = otp.replace(/\D/g, "").slice(0, OTP_LENGTH);
  const isValidOtp = OTP_REGEX.test(otpTrimmed);
  const canSubmit = isValidOtp && !isLoading;

  const handleBackToLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    await validateOtp(otpTrimmed);
  };

  const handleResend = async () => {
    setResendError(null);
    setResendSuccess(false);
    setResendLoading(true);
    try {
      await authService.resendOtp(email);
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

            {error && <Alert severity="error">{error}</Alert>}
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
              disabled={resendLoading || !email}
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

export default function ValidateOtpPage() {
  return (
    <Suspense>
      <ValidateOtpForm />
    </Suspense>
  );
}

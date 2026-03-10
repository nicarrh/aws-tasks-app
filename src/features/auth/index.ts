import { useAuth } from './hooks/useAuth';
import { getValidAccessToken } from './infraestructure/auth.service';
import { ConfirmCodeScreen } from './presentation/screens/confirm-code-screen/ConfirmCodeScreen';
import ConfirmTotpScreen from './presentation/screens/confirm-totp/ConfirmTotp';
import LoginScreen from './presentation/screens/login-screen/LoginScreen';
import RegisterScreen from './presentation/screens/register-screen/RegisterScreen';
import SetupTotpScreen from './presentation/screens/setup-totp/SetupTotp';

export {
  ConfirmCodeScreen,
  ConfirmTotpScreen,
  getValidAccessToken,
  LoginScreen,
  RegisterScreen, SetupTotpScreen, useAuth
};


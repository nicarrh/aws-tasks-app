import { useAuth } from './hooks/useAuth';
import { getValidAccessToken } from './infraestructure/auth.service';
import { ConfirmCodeScreen } from './presentation/screens/confirm-code-screen/ConfirmCodeScreen';
import LoginScreen from './presentation/screens/login-screen/LoginScreen';
import RegisterScreen from './presentation/screens/register-screen/RegisterScreen';

export { ConfirmCodeScreen, getValidAccessToken, LoginScreen, RegisterScreen, useAuth };

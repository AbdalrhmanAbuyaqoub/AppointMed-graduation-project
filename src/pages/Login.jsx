import { AuthenticationImage } from "../components/Login/AuthenticationImage";
import { useAuthentication } from "../hooks/useAuthentication";

const Login = () => {
  const { handleLogin } = useAuthentication();

  return <AuthenticationImage onSubmit={handleLogin} />;
};

export default Login;

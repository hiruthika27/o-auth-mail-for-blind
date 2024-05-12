import { useNavigate } from 'react-router-dom';
//import { useGoogleLogout } from '@react-oauth/google';

const useLogout = () => {
  const navigate = useNavigate();
  //const { signOut } = useGoogleLogout();

  const logout = () => {
    //signOut();
    // Clear token from local storage
    localStorage.removeItem("accesstkn");
    localStorage.removeItem("authcode");
    // Redirect to login page
    navigate("/");
  };

  return logout;
};

export default useLogout;
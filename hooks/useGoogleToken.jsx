import { useState } from "react";
import { GoogleAuthContextProvider, useGoogleAuthContext} from "../context/GoogleAuthContext.jsx";


const useGoogleAuth = () => {
    const [accessToken, setAccessToken] = useState(null);
    const { clientId, clientSecret } = useGoogleAuthContext();
    const code = localStorage.getItem("authcode")
    const exchangeCodeForToken = async (code) => {
        try {
            const serverResponse = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    client_id: `${clientId}`,
                    client_secret: `${clientSecret}`,
                    code: `${code}`,
                    grant_type: "authorization_code",
                    redirect_uri: "http://localhost:5173",
                }),
            });

            const data = await serverResponse.json();
            if (data.access_token) {
                setAccessToken(data.access_token);
                
            }
            return data;
        } catch (error) {
            console.error("Token Exchange Error:", error);
            throw error;
        }
    };

    return { accessToken, exchangeCodeForToken };
};

export default useGoogleAuth;
import React, { createContext, useContext } from "react";

// Create a context for Google OAuth credentials
const GoogleAuthContext = createContext();

// Custom hook to access Google OAuth credentials from the context
export const useGoogleAuthContext = () => useContext(GoogleAuthContext);

// Provider component to supply Google OAuth credentials
export const GoogleAuthContextProvider = ({ children }) => {
    // Replace these with your actual client ID and client secret
    const clientId = "";
    const clientSecret = "";

    return (
        <GoogleAuthContext.Provider value={{ clientId, clientSecret }}>
            {children}
        </GoogleAuthContext.Provider>
    );
};
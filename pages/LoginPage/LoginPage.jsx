import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./login.css";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
//import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';
import { useGoogleAuthContext } from "../../context/GoogleAuthContext.jsx";
import useGoogleAuth from "../../hooks/useGoogleToken.jsx"
import glogo from "../../assets/google.png";
import useSpeechSynthesis from '../../hooks/customSpeechSynthesis.js';




const LoginPage = () => {
    const { clientId } = useGoogleAuthContext();
    const { accessToken, exchangeCodeForToken } = useGoogleAuth();

    const navigate = useNavigate();
    const { speak } = useSpeechSynthesis();
    const [authorizationCode, setAuthorizationCode] = useState(null);

    const login = useGoogleLogin({
        clientId: `${clientId}`, // Replace with your actual Client ID
        flow: "code", // Specify the Authorization Code Flow
        onSuccess: async (response) => {
            try {
                const authCode = response.code;
                localStorage.setItem("authcode", authCode) // Extract the authorization code
                setAuthorizationCode(authCode); // Store the authorization code temporarily (optional)
                const tokenData = await exchangeCodeForToken(authCode);
                // Handle the access token and user information from the backend
                console.log("Access Token:", tokenData.access_token);

                const currentTime = new Date().getTime();
                const tokenInfo = {
                    accessToken: tokenData.access_token,
                    timestamp: currentTime
                };
                const tokenInfoString = JSON.stringify(tokenInfo);
                localStorage.setItem("accesstkn", tokenInfoString);
                // Navigate to options page only after access token is stored
                navigate("/options");
                console.log("Navigating to options page...");

            } catch (error) {
                console.error("Login Error:", error);
                // Handle login errors (display message, etc.)
            } 
        },
        onError: (error) => {
            console.error("Login Error:", error);
            // Handle login errors (display message, etc.)
        },
    });

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []); // Run once on component mount

    const handleKeyDown = (event) => {
        if (event.key === 'j') {
            speak('Welcome to V-mail, to login with Google, please click the button');
        }
    };

    // const check = () => { 
    //     speak('Welcome to V-mail, to login with Google, please click the button');
    //     console.log("executed") 
    // }
    const isTokenValid = () => {
        // Get token info from local storage
        const tokenInfoString = localStorage.getItem("accesstkn");
        if (!tokenInfoString) {
            return false; // No token found, user needs to login
        }

        const tokenInfo = JSON.parse(tokenInfoString);
        const currentTime = new Date().getTime();
        const tokenTime = tokenInfo.timestamp;
        const tokenExpirationTime = tokenTime + (60 * 60 * 1000); // One hour in milliseconds
        if (currentTime >= tokenExpirationTime) {
            // Token is expired, remove it from local storage
            localStorage.removeItem("accesstkn");
            localStorage.removeItem("authcode");
            return false; // Token is not valid
        }


        return true;
    };


return (
        <div className="login" >
            <div className="containerl">
                <div className="form_containerl" onMouseDown={async () => {
                    if (await isTokenValid()) {
                        navigate("/options");
                    } else {
                        login();
                    }
                }}>
                    <span className="for_span">
                        <label className="for_label">
                            Login with Google
                        </label>
                    </span>

                    <div className="loginbtn1">
                        <div className="btn_wrapper" >
                            <div className="g_image">
                                <img src={glogo} alt="google" />
                            </div>
                            <div className="g_contents">
                                <span className="g_span">
                                    <label className="g_label">Login with Google</label>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overlay_container">
                    <div className="overlay">
                        <div className="overlay_panel">
                            <h1>V-Mail</h1>
                            <p>a voice based emailing system for visually impaired</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
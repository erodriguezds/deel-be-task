import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const token = sessionStorage.getItem("token");
    console.log("token: ", token);
    const navigate = useNavigate();
    const login = function(profile){
        // here goes the actual login 
        // ...
        api.setAuth(profile.id);
        sessionStorage.setItem('token', profile.id);
        setProfile(profile);
        navigate('/dashboard');
    }
    const logout = function(){
        setProfile(null);
        sessionStorage.removeItem("token");
        navigate('/login');
    };
    const updateProfile = function(data){
        setProfile({...profile, ...data});
    };

    useEffect(() => {
        console.log("Token: ", token);
        if(token){
            api.setAuth(parseInt(token));
            api.getProfile().then(data => setProfile(data));
        } else {
            console.log("navegando a login");
            navigate('/login');
        }
    }, []);

    return (
        <AuthContext.Provider value={{ profile, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

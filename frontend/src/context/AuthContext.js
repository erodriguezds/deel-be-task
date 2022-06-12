import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [profile, setProfile] = useState(JSON.parse(sessionStorage.getItem("profile") || "null"));
    const navigate = useNavigate();
    const login = function(profile){
        // here goes the actual login 
        // ...
        api.setAuth(profile.id);
        sessionStorage.setItem('profile', JSON.stringify(profile));
        setProfile(profile);
        navigate('/dashboard');
    }
    const logout = function(){
        setProfile(null);
        navigate('/login');
    };
    const updateProfile = function(data){
        setProfile({...profile, ...data});
    };

    useEffect(() => {
        if(profile){
            api.setAuth(profile.id);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ profile, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

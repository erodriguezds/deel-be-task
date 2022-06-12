import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import AuthContext from "./AuthContext";
import Swal from 'sweetalert2';

const JobsContext = createContext({});

export const JobsProvider = ({ children }) => {
    const { profile } = useContext(AuthContext);
    const [ jobs, setJobs ] = useState([]);
    const payJob = async (id) => {
        const result = await startPayFlow(id);
        if(result){
            console.log("Payment result: ", result);
            const jobs = await api.getJobs();
            setJobs(jobs);
        }
    };

    useEffect(() => {
        if(profile){
            api.getJobs().then(data => setJobs(data));
        }
    }, [profile]);

    return (
        <JobsContext.Provider value={{ jobs, payJob }}>
            {children}
        </JobsContext.Provider>
    );
}



export default JobsContext;

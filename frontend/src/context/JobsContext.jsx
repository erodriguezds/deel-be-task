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

async function startPayFlow(id){

    var result = false;

    const { isConfirmed } = await Swal.fire({
        title: 'Confirm payment',
        text: `Do you confirm the payment of job #${id}?`,
        icon: 'warning',
        showCancelButton: true,
        //confirmButtonColor: '#3085d6',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Pay'
    });

    if(!isConfirmed) return false;
    
    try {
        result = await api.payJob(id);
        Swal.fire(
            'Done!',
            'Your new balance is: ' + result.tResult.newBalance,
            'success'
        );
    } catch(payError){
        const message = (
            payError.response && payError.response.data.error ?
            payError.response.data.error :
            payError.message
        );
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
        });
        return false;
    }

    return result;
}

export default JobsContext;

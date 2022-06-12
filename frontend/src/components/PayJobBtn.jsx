import { useCallback } from "react";
import { Button } from "react-bootstrap";
import api from "../api";
import Swal from 'sweetalert2'


export default function PayJobBtn({jobId}){
    return (
        <Button
            variant="primary"
            size="sm"
            onClick={() => startPayFlow(jobId)}
        >Pay</Button>
    );
}

async function startPayFlow(id){
    const { isConfirmed } = await Swal.fire({
        title: 'Confirm payment',
        text: `Do you confirm the payment of job #${id}?`,
        icon: 'warning',
        showCancelButton: true,
        //confirmButtonColor: '#3085d6',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Pay'
    });

    if(!isConfirmed) return;
    
    try {
        const response = await api.payJob(id);
        console.log(response);
        Swal.fire(
            'Done!',
            'Your new balance is: ' + response.tResult.newBalance,
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
    }
}
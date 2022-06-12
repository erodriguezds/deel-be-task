import { useCallback } from "react";
import { Button } from "react-bootstrap";
import api from "../api";
import Swal from 'sweetalert2'


export default function PayJobBtn({jobId, onClick}){
    return (
        <Button
            variant="primary"
            size="sm"
            onClick={() => onClick(jobId)}
        >Pay</Button>
    );
}


import { Badge, Card } from "react-bootstrap";
import DataTable from "./DataTable";
import api from "../api";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import PayJobBtn from "./PayJobBtn";
import Swal from "sweetalert2";
import formatter from "../util/currencyFormatter";

function profileToString(profile){
    return `${profile.firstName} ${profile.lastName} (${profile.profession})`;
}

export default function Jobs(){
    const [ jobs, setJobs] = useState([]);
    const { profile, updateProfile } = useContext(AuthContext);
    const handlePay = async (id) => {
        const result = await startPayFlow(id);
        console.log("pay result: ", result);
        if(result){
            updateProfile({balance: result.tResult.newBalance});
            const jobs = await api.getJobs();
            setJobs(jobs);
        }
    };
    const columns = [
        { label: "ID", field: "id"},
        { label: "Contract ID", render: job => job.ContractId},
        { label: "Description", field: "description"},
        { label: "Price", render: job => `$ ${job.price}`},
        {
            label: "Status",
            render: job => (
                job.paid ?
                <Badge bg="success">PAID</Badge> :
                <Badge bg="warning">NOT PAID</Badge>
            )
        },
        {
            label: "Actions",
            visible: profile.type === 'client',
            render: (job) => (
                !job.paid ?
                <PayJobBtn jobId={job.id} onClick={handlePay} /> :
                null
            ) 
        }
    ];

    useEffect(() => {
        api.getJobs().then(data => setJobs(data));
    }, []);

    return (
        <Card className="m-3">
            <Card.Header>
                <Card.Title>Jobs</Card.Title>
            </Card.Header>
            <Card.Body>
                <DataTable
                    data={jobs}
                    columns={columns}
                />
            </Card.Body>
        </Card>
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
            'Your new balance is: ' + formatter.format(result.tResult.newBalance),
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

import { Badge, Card } from "react-bootstrap";
import DataTable from "./DataTable";
import api from "../api";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import PayJobBtn from "./PayJobBtn";

function profileToString(profile){
    return `${profile.firstName} ${profile.lastName} (${profile.profession})`;
}

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
        render: (job) => (
            !job.paid ?
            <PayJobBtn jobId={job.id} /> :
            null
        ) 
    }
];

export default function Jobs(){
    const [ jobs, setJobs] = useState([]);
    const auth = useContext(AuthContext);

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
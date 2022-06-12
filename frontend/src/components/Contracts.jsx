import { Badge, Card } from "react-bootstrap";
import DataTable from "./DataTable";
import api from "../api";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function profileToString(profile){
    return `${profile.firstName} ${profile.lastName} (${profile.profession})`;
}

function statusToBadge(status){
    if(status === 'in_progress') return <Badge bg="warning">IN PROGRESS</Badge>
    if(status === 'new') return <Badge bg="info">NEW</Badge>
    return <Badge bg="info">{status.toUpperCase()}</Badge>
}

const clientColumns = [
    { label: "ID", field: "id"},
    { label: "Contractor", render: contract => profileToString(contract.Contractor) },
    { label: "Status", render: contract => statusToBadge(contract.status)},
];

const contractorColumns = [
    { label: "ID", field: "id"},
    { label: "Client", render: contract => profileToString(contract.Client) },
    { label: "Status", render: contract => statusToBadge(contract.status)},
];

export default function Contracts(){
    const [ contracts, setContracts] = useState([]);
    const auth = useContext(AuthContext);
    const isClient = (auth.profile.type === 'client');

    useEffect(() => {
        api.getContracts().then(data => setContracts(data));

    }, []);

    return (
        <Card className="my-3 mx-1">
            <Card.Header>
                <Card.Title>Contracts</Card.Title>
            </Card.Header>
            <Card.Body>
                <DataTable
                    data={contracts}
                    columns={isClient ? clientColumns : contractorColumns}
                />
            </Card.Body>
        </Card>
    );
}
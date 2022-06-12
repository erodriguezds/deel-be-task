import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import Swal from 'sweetalert2'
import api from "../../api";
import formatter from "../../util/currencyFormatter";

export default function BestProfession(){

    const [ best, setBest ] = useState([]);
    const [ range, setRange ] = useState({
        start: "2020-01-01",
        end: "2022-12-31"
    });
    const handleRangeChange = (event) => {
        const newRange = {
            ...range,
            [event.target.name]: event.target.value
        };
        setRange(newRange);
        api.getBestProfessions(newRange.start, newRange.end).then(data => setBest(data));
    }

    useEffect(() => {
        api.getBestProfessions(range.start, range.end).then(data => setBest(data));
    }, [])
    
    return (
        <Card className="m-3">
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <h5 className="text-muted fw-normal mt-0" title="Best Profession">Best Profession</h5>
                    <h5 className="text-muted fw-normal mt-0" title="Best Profession">Paid</h5>
                </div>
                
                {
                    best.length > 0 ?
                    <>
                        <h4>{best[0].profession}</h4>
                        <h3 className="mt-3 mb-3">{formatter.format(best[0].totalPaid)}</h3>
                    </> :
                    <h3 className="mt-3 mb-3">(None)</h3>
                }
                <Form.Group as={Row} className="mb-3" controlId="bestProfessionFrom">
                    <Form.Label column sm={4}>From: </Form.Label>
                    <Col sm={8}>
                        <Form.Control type="date" name="start" onChange={handleRangeChange} value={range.start} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="bestProfessionTo">
                    <Form.Label column sm={4}>To: </Form.Label>
                    <Col sm={8}>
                        <Form.Control type="date" name="end" onChange={handleRangeChange} value={range.end} />
                    </Col>
                </Form.Group>
            </Card.Body>
        </Card>
    );
}

async function startAddBalanceFlow(){
    const { value: ammount } = await Swal.fire({
        title: 'Deposit',
        input: 'number',
        inputLabel: 'Enter the ammount to deposit into your balance:',
        inputPlaceholder: '$100.00',
        showCancelButton: true,
    });
      
    if (!ammount) return false;
    
    const { isConfirmed } = await Swal.fire({
        title: 'Confirm deposit',
        text: `Your are about to deposit ${ammount} into your balance`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Do it'
    });
        
    if(!isConfirmed) return false;
    
    try {
        const response = await api.deposit(parseInt(ammount));
        Swal.fire(
            'Done!',
            'Your new balance is: ' + response.tResult.newBalance,
            'success'
        );
        return response.tResult.newBalance;
    } catch(err) {
        const message = (
            err.response && err.response.data.error ?
            err.response.data.error :
            err.message
        );
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
        });
    }
};

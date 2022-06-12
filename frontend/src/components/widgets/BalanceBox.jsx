import { useContext } from "react";
import { Card, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import api from "../../api";
import AuthContext from "../../context/AuthContext";

//const MySwal = withReactContent(Swal)



export default function BalanceBox(){

    const { profile, updateProfile } = useContext(AuthContext);
    const balance = profile.balance;
    const allowAdd = profile.type === 'client';
    
    return (
        <Card className="m-3">
            <Card.Body>
                { allowAdd &&
                <div className="float-end">
                    <Button onClick={async () => {
                        const newBalance = await startAddBalanceFlow();
                        if(newBalance){
                            updateProfile({balance: newBalance});
                        }
                    }}>+</Button>
                </div>
                }
                <h5 className="text-muted fw-normal mt-0" title="Current Balance">Current Balance</h5>
                <h3 className="mt-3 mb-3">{`$ ${balance}`}</h3>
                <p className="mb-0 text-muted">
                    <span className="text-success me-2"><i className="mdi mdi-arrow-up-bold"></i> 5.27%</span>
                    <span className="text-nowrap">Since last month</span>  
                </p>
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

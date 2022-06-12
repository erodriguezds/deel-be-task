import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Contracts from '../components/Contracts';
import Jobs from '../components/Jobs';
import BalanceBox from '../components/widgets/BalanceBox';
import AuthContext from '../context/AuthContext';


export default function Dashboard(props){
    
    const { profile, logout } = useContext(AuthContext);
    const isClient = (profile.type === 'client');

    return (
        <>
            <Navbar bg="primary" variant="dark">
                <Container>
                <Navbar.Brand href="#home">Deel</Navbar.Brand>
                <Navbar.Text>Welcome <b>{`${profile.firstName} ${profile.lastName} (${profile.profession})`}</b></Navbar.Text>
                <Nav className="me-auto">

                </Nav>
                <Nav>
                    <Nav.Link href="#" onClick={() => logout()}>Logout</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
            <Container>
            <Row>
                <Col md={3}>
                    <BalanceBox balance={profile.balance} allowAdd={isClient}/>
                </Col>
                <Col md={4}>
                    <Contracts />
                </Col>
                <Col md={5}>
                    <Jobs />
                </Col>
            </Row>
            </Container>
        </>
    );
}
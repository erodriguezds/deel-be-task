import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Contracts from '../components/Contracts';
import Jobs from '../components/Jobs';
import BalanceBox from '../components/widgets/BalanceBox';
import BestClients from '../components/widgets/BestClients';
import BestProfession from '../components/widgets/BestProffesion';
import AuthContext from '../context/AuthContext';


export default function Dashboard(props){
    
    const { profile, logout } = useContext(AuthContext);
    const isClient = (profile && profile.type === 'client');

    if(!profile) return null;

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
                    <Col lg={3} sm={5}>
                        <BalanceBox balance={profile.balance} allowAdd={isClient}/>
                    </Col>
                    <Col lg={4} sm={7}>
                        <Contracts />
                    </Col>
                    <Col lg={5} sm={12}>
                        <Jobs />
                    </Col>
                </Row>
                <Row>
                    
                    <Col lg={4}>
                        <BestProfession/>
                    </Col>
                    <Col lg={4}>
                        <BestClients/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
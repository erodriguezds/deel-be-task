import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm';
import { Container } from 'react-bootstrap';
import { Link, Outlet } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Container fluid>
        <Outlet></Outlet>
      </Container>
    </AuthProvider>
  );
}

export default App;

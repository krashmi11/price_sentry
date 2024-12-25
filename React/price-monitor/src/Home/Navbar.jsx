import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './CSS/Navbar.css';  // Import your custom CSS file
import { Link, useNavigate} from 'react-router-dom';

import axios from 'axios';
function BasicExample() {


  // const navigate = useNavigate();

  // const handleLogout = async () => {
  //     try {
  //         const response = await axios.get('http://localhost:8080/logout');
  //         if (response.status === 200) {
  //           alert('Logout successful!');
  //           navigate('/login');
  //         } else {
  //             alert('Logout failed. Please try again.');
  //         }
  //     } catch (error) {
  //         console.error('There was an error logging out!', error);
  //         alert('An error occurred. Please try again later.');
  //     }
  // };
  return (
    <Navbar expand="lg" className="bg-custom">
      <Container>
        <Navbar.Brand href="#home"><b>Price Sentry</b></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link href="#link">About</Nav.Link>
            <NavDropdown title="Register" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/register">Signup</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
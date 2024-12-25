import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './CSS/Navbar.css';  // Import your custom CSS file
import { Link, useNavigate} from 'react-router-dom';

import axios from 'axios';
function BasicExample() {


  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
          const response = await axios.get('http://localhost:8080/logout');
          if (response.status === 200) {
            localStorage.removeItem('username');
            alert('Logout successful!');
            navigate('/login');
          } else {
              alert('Logout failed. Please try again.');
          }
      } catch (error) {
          console.error('There was an error logging out!', error);
          alert('An error occurred. Please try again later.');
      }
  };
  return (
    <Navbar expand="lg" className="bg-custom">
      <Container>
        <Navbar.Brand href="#home"><b>Price Sentry</b></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/users/index/0">Home</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
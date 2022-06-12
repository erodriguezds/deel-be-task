import { useEffect, useState, useContext } from "react";
import { Form, Button, Card } from "react-bootstrap";
import api from "../api";
import AuthContext from "../context/AuthContext";

export default function LoginForm(props) {

  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const auth = useContext(AuthContext);

  useEffect(() => {
    api.getUsers().then(data => {
      console.log("Data: ", data);
      setProfiles(data);
    });
  }, []);

  return (
    <div className="d-flex justify-content-center h-100">
      <Form onSubmit={event => {
        event.preventDefault();
        if(selectedProfile){
          auth.login(selectedProfile);
        }
      }}>
      <Card style={{ maxWidth: "300px" }}>
        <Card.Header>
          Login
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username:</Form.Label>
            <Form.Select
              name="profile_id"
              aria-label="Default select example"
              onChange={event => {
                //console.log("select onChange: ", event.target.value);
                const id = parseInt(event.target.value);
                const profile = profiles.find(p => p.id === id);
                setSelectedProfile(profile);
              }}
            >
              <option value="-1">(Choose a profile)</option>
              {profiles.map(profile => (
                <option
                  key={profile.id}
                  value={profile.id}
                >{`${profile.firstName} ${profile.lastName} (${profile.type})`}</option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              The weirdest login control you've ever seen
            </Form.Text>
          </Form.Group>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Card.Footer>
        
          
          
      </Card>
      </Form>

    </div>

  );

}
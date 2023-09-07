import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";  

import { useState, useEffect } from "react";
const CLIENT_ID = "5836aada8d05463ca524952c51cbf257";
const CLIENT_SECRET = "533cbf0bbd1c455c966bba34f1523580";

function App() {
  const [search, setSearch] = useState("");
  const [access, setAccess] = useState("");
  const [artistID, setArtistID] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [infoText, setInfoText] = useState("This page is a Spotify artist and album search application. Please enter an artist or album name. Don't forget to type artist name fully correct!");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    var authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => setAccess(data.access_token));
  }, []);

  async function searcher() {
    if (!search) {
      setInfoText("This page is a Spotify artist and album search application. Please enter an artist or album name. Don't forget to type artist name fully correct!");
      return;
    }

    setLoading(true);  

    var artistParam = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access,
      },
    };

    try {
      var artistResponse = await fetch(
        "https://api.spotify.com/v1/search?q=" + search + "&type=artist",
        artistParam
      );
      var data = await artistResponse.json();
      var firstArtist = data.artists.items[0];
      setArtistID(firstArtist.id);

      if (artistID) {
        var albumsResponse = await fetch(
          "https://api.spotify.com/v1/artists/" +
            artistID +
            "/albums" +
            "?include_groups=album&market=US&limit=50",
          artistParam
        );
        var albumsData = await albumsResponse.json();
        setAlbums(albumsData.items);
        setInfoText("");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);  
    }
  }

  return (
    <Container fluid className="text-center mt-4">
      <Row className="align-items-center justify-content-center mb-4">
        <div className="erdemlabel">
          <a
            href="https://github.com/erdemonal11"
            target="_blank"
            className="erdemlabel"
          >
            erdemapps.
          </a>
        </div>
      </Row>
      <InputGroup className="mb-3" size="lg">
        <FormControl
          placeholder="Search for artists..."
          type="input"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              searcher();
            }
          }}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button onClick={searcher}>Search</Button>
      </InputGroup>
      <p className="text-danger">{infoText}</p>
      {loading && <p>Loading...</p>}
      <Container fluid>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {albums.map((album, i) => (
            <Card key={i}>
              <Card.Img src={album.images[0].url} />
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default App;

/* eslint-disable jsx-a11y/iframe-has-title */
import "./App.css";
import { Button, Card, Grid, Paper, Skeleton } from "@mui/material";
import Temperature from "./components/DataComponents/Temperature";
import Connectivity from "./components/DataComponents/Connectivity";
import Equipment from "./components/DataComponents/Equipment";
import * as mqtt from "mqtt/dist/mqtt";

function App() {
  const client = mqtt.connect("ws://localhost:8883");

  return (
    <Paper className="App">
      <header className="App-header">
        <h1>Greenhouse Monitoring</h1>
        <Button
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            margin: 1,
          }}
        >
          Linkage Control 
        </Button>
      </header>
      <Grid container spacing={2} direction="row" p={1}>
        <Grid item xs={2}>
          <Card elevation={3}>
            <Skeleton
              variant="rectangular"
              width={600}
              height={670}
              animation="pulse"
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={3}
          container
          spacing={2}
          direction="column"
          display="block"
        >
          <Grid item xs={6}>
            <Card elevation={3}>
              <Skeleton
                variant="rectangular"
                width={600}
                height={325}
                animation="pulse"
              />
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card elevation={3}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15915.26231203641!2d27.90097752428144!3d-33.009787010696925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e66e156794ba95d%3A0xc8f76e377bbebbd1!2sGreenhouse%20Tunnels%20Eastern%20Cape!5e0!3m2!1sen!2sza!4v1696049125879!5m2!1sen!2sza"
                width={600}
                height={325}
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </Card>
          </Grid>
        </Grid>
        <Grid
          item
          xs={7}
          container
          spacing={2}
          direction="column"
          display="block"
        >
          <Grid
            item
            xs={6}
            container
            spacing={2}
            direction="row"
            width={900}
            height={325}
          >
            <Grid
              item
              xs={6}
              display="block"
              container
              spacing={2}
              direction="column"
              width={900}
              height={325}
            >
              <Grid item xs={6} display="block">
                <Card elevation={3}>
                  <Temperature client={client} />
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card elevation={3}>
                  <Connectivity client={client} />
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={6} width={900} height={325}>
              <Card elevation={3}>
                <Equipment client={client} />
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={6} container width={885} height={325} mt={4}>
            <Grid item xs={12}>
              <Card elevation={3}>
                <Skeleton
                  variant="rectangular"
                  width={870}
                  height={325}
                  animation="pulse"
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default App;

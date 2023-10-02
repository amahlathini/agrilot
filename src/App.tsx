/* eslint-disable jsx-a11y/iframe-has-title */
import "./App.css";
import { Button, Card, Grid, Paper, Skeleton } from "@mui/material";
import Temperature from "./components/DataComponents/Temperature";
import Connectivity from "./components/DataComponents/Connectivity";
import Equipment from "./components/DataComponents/Equipment";
import * as mqtt from "mqtt/dist/mqtt";
import { useCallback, useEffect, useState } from "react";

function App() {
  const client = mqtt.connect("ws://localhost:8883");

  const [linkageEnabled, setLinkageEnabled] = useState(false);

  const sendUpdate = useCallback(
    (topic: string, status: Partial<"on" | "off" | "start" | "stop">) =>
      client.publish(topic, status, { qos: 1 }, (err) => {
        if (err) {
          console.error("Error publishing message:", err);
        }
      }),
    [client]
  );

  const handleLinkageControl = () => {
    setLinkageEnabled((prevEnabled) => !prevEnabled);
  };

  useEffect(() => {
    const handleIlluminationControl = (illumination: number) => {
      if (linkageEnabled) {
        if (illumination < 300) {
          sendUpdate("greenhouse/fill-light", "on");
        } else if (illumination > 1000) {
          sendUpdate("greenhouse/fill-light", "off");
        }
      }
    };

    const handleSoilMoistureControl = (moisture: number) => {
      if (linkageEnabled) {
        if (moisture < 30) {
          sendUpdate("greenhouse/sprinkler", "start");
        } else if (moisture > 60) {
          sendUpdate("greenhouse/sprinkler", "stop");
        }
      }
    };
    if (client) {
      if (linkageEnabled) {
        client.subscribe("greenhouse/control", (error) => {
          if (error) {
            console.log("Subscribe to topics error", error);
          }
        });

        client.on("message", (topic, message) => {
          const { illumination, soilMoisture } = JSON.parse(message.toString());

          handleIlluminationControl(illumination);
          handleSoilMoistureControl(soilMoisture);
        });
      } else {
        client.unsubscribe("greenhouse/control");
      }
    }
  }, [client, linkageEnabled, sendUpdate]);

  return (
    <Paper className="App" sx={{ bg: "transparent" }}>
      <header className="App-header">
        <h1>Greenhouse Monitoring</h1>
        <Button
          variant="contained"
          onClick={handleLinkageControl}
          sx={{
            m: 1,
          }}
          color={linkageEnabled ? "success" : "primary"}
        >
          {linkageEnabled ? "Linkage Control On" : "Linkage Control Off"}
        </Button>
      </header>
      <Grid container spacing={2} direction="row" p={1} color="transparent">
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

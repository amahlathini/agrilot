import { FormControlLabel, FormGroup, Grid, Switch } from "@mui/material";
import { MdSensors } from "react-icons/md";
import { RiAlarmWarningLine } from "react-icons/ri";
import CustomizedSteppers from "../Shared/Stepper";
import { useCallback, useEffect, useState } from "react";
import { MQTTProps } from "../../types/MQTTProps";

const Connectivity = ({ client }: MQTTProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const sendUpdate = useCallback(
    (topic: string, status: boolean) =>
      client.publish(
        topic,
        JSON.stringify({
          checked: status,
        }),
        { qos: 1 },
        (err) => {
          if (err) {
            console.error("Error publishing message:", err);
          }
        }
      ),
    [client]
  );

  useEffect(() => {
    if (client) {
      client.subscribe("greenhouse/connectivity", (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
        }
      });

      client.on("message", (topic, message) => {
        // console.log(topic, message);
        // sendUpdate("greenhouse/connectivity", isConnected);

        if (!isConnected) return client.end();
      });
    }
  }, [client, isConnected, sendUpdate]);
  const activeStep: number = isConnected ? 2 : client.reconnecting ? 1 : 0;

  const color = isConnected ? "lime" : "grey";

  return (
    <Grid container spacing={4} direction="row">
      <Grid
        item
        xs={6}
        maxWidth={50}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        pb={2}
      >
        <RiAlarmWarningLine size={100} color={color} />
        <CustomizedSteppers activeStep={activeStep} />
      </Grid>
      <Grid
        item
        xs={6}
        maxWidth={50}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        pb={2}
      >
        <MdSensors size={100} color={color} />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isConnected}
                onChange={(e, checked) => {
                  setIsConnected(checked);
                  sendUpdate("greenhouse/connectivity", checked);
                  if (checked && client.disconnected) {
                    client.connect();
                  }
                }}
              />
            }
            label="On"
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default Connectivity;

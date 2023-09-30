import { FormControlLabel, FormGroup, Grid, Switch } from "@mui/material";
import { TbAirConditioningDisabled } from "react-icons/tb";
import { BsFan } from "react-icons/bs";
import { SiRainmeter } from "react-icons/si";
import LightIcon from "@mui/icons-material/Light";
import { MQTTProps } from "../../types/MQTTProps";
import { useCallback, useEffect, useState } from "react";

const Equipment = ({ client }: MQTTProps) => {
  const [isHeaterOn, setIsHeaterOn] = useState<boolean>(false);
  const [isFanOn, setIsFanOn] = useState<boolean>(false);
  const [isLightOn, setIsLightOn] = useState<boolean>(false);
  const [isSprintlerOn, setIsSprintlerOn] = useState<boolean>(false);

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
      client.subscribe("greenhouse/equipment", (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
        }
      });

      // client.on("message", (topic, message) => {
      //   sendUpdate("greenhouse/equipment/sprintler", isSprintlerOn);
      //   sendUpdate("greenhouse/equipment/light", isLightOn);
      //   sendUpdate("greenhouse/equipment/fan", isFanOn);
      //   sendUpdate("greenhouse/equipment/heater", isHeaterOn);
      // });
    }
  }, [client, isFanOn, isHeaterOn, isLightOn, isSprintlerOn, sendUpdate]);

  const heaterColor = isHeaterOn ? "lime" : "grey";
  const fanColor = isFanOn ? "lime" : "grey";
  const lightColor = isLightOn ? "lime" : "grey";
  const splintlerColor = isSprintlerOn ? "lime" : "grey";

  return (
    <Grid container spacing={4} direction="column" p={5}>
      <Grid container spacing={5} direction="row">
        <Grid
          item
          xs={6}
          maxWidth={50}
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <TbAirConditioningDisabled size={100} color={heaterColor} />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={false}
                  value={isHeaterOn}
                  onChange={(e, checked) => {
                    setIsHeaterOn(checked);
                    sendUpdate("greenhouse/equipment/heater", checked);
                  }}
                />
              }
              label="On"
            />
          </FormGroup>
        </Grid>
        <Grid
          item
          xs={6}
          maxWidth={50}
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <LightIcon
            fontSize="large"
            sx={{ fontSize: 100, color: lightColor }}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  value={isLightOn}
                  onChange={(e, checked) => {
                    setIsLightOn(checked);
                    sendUpdate("greenhouse/equipment/light", checked);
                  }}
                />
              }
              label="On"
            />
          </FormGroup>
        </Grid>
      </Grid>
      <Grid container spacing={5} direction="row">
        <Grid
          item
          xs={6}
          maxWidth={50}
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <BsFan size={100} color={fanColor} />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  value={isFanOn}
                  onChange={(e, checked) => {
                    setIsFanOn(checked);
                    sendUpdate("greenhouse/equipment/fan", checked);
                  }}
                />
              }
              label="On"
            />
          </FormGroup>
        </Grid>
        <Grid
          item
          xs={6}
          maxWidth={50}
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <SiRainmeter size={100} color={splintlerColor} />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  value={isSprintlerOn}
                  onChange={(e, checked) => {
                    setIsSprintlerOn(checked);
                    sendUpdate("greenhouse/equipment/sprintler", checked);
                  }}
                />
              }
              label="On"
            />
          </FormGroup>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Equipment;

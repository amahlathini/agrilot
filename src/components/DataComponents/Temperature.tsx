import { FormControlLabel, FormGroup, Grid, Switch } from "@mui/material";
import GaugeComponent from "react-gauge-component";
import { TbSteam } from "react-icons/tb";
import { useCallback, useEffect, useState } from "react";
import { MQTTProps } from "../../types/MQTTProps";

const Temperature = ({ client }: MQTTProps) => {
  const [temperature, setTemperature] = useState<number>(0);
  const [isSensorOn, setIsSensorOn] = useState<boolean>(false);

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
      client.subscribe("greenhouse/sensor", (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
        }
      });

      client.on("message", (topic, message) => {
        setTemperature(
          isSensorOn && client.connected
            ? JSON.parse(message.toString())?.temperature
            : 0
        );
        sendUpdate("greenhouse/temperature", isSensorOn);
      });
    }
  }, [client, isSensorOn, sendUpdate]);

  const color = isSensorOn && client.connected ? "lime" : "grey";

  return (
    <Grid container spacing={4} direction="row">
      <Grid
        item
        xs={7}
        maxWidth={60}
        alignItems="center"
        justifyContent="center"
      >
        <GaugeComponent
          type="semicircle"
          arc={{
            width: 0.2,
            padding: 0.005,
            cornerRadius: 1,
            // gradient: true,
            subArcs: [
              {
                limit: 15,
                color: "#ffffff",
                showTick: true,
                tooltip: {
                  text: "Too low temperature!",
                },
                onClick: () => console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
                onMouseMove: () =>
                  console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"),
                onMouseLeave: () =>
                  console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"),
              },
              {
                limit: 17,
                color: "#ffff99",
                showTick: true,
                tooltip: {
                  text: "Low temperature!",
                },
              },
              {
                limit: 28,
                color: "#ffcc33",
                showTick: true,
                tooltip: {
                  text: "OK temperature!",
                },
              },
              {
                limit: 30,
                color: "#ee6600",
                showTick: true,
                tooltip: {
                  text: "High temperature!",
                },
              },
              {
                color: "#990000",
                tooltip: {
                  text: "Too high temperature!",
                },
              },
            ],
          }}
          pointer={{
            color: "#345243",
            length: 0.8,
            width: 15,
            // elastic: true,
          }}
          labels={{
            valueLabel: { formatTextValue: (value) => value + "ºC" },
            tickLabels: {
              type: "outer",
              defaultTickValueConfig: {
                formatTextValue: (value) => value + "ºC",
                maxDecimalDigits: 2,
                style: { fontSize: 2, color: "black", background: "black" },
              },
              ticks: [{ value: 13 }, { value: 22.5 }, { value: 32 }],
            },
          }}
          value={temperature}
          minValue={10}
          maxValue={35}
        />
      </Grid>
      <Grid
        item
        xs={5}
        maxWidth={50}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        pb={2}
      >
        <TbSteam size={100} color={color} />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isSensorOn}
                onChange={(e, checked) => {
                  setIsSensorOn(checked);
                  sendUpdate("greenhouse/temperature", checked);
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

export default Temperature;

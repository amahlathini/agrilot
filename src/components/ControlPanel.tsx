import { Button, Typography } from "@mui/material";
import * as mqtt from "mqtt/dist/mqtt";

type ControlPanelProps = {
  client: mqtt.MqttClient;
};

const ControlPanel = ({ client }: ControlPanelProps) => {

  const handleFanControl = (action: "on" | "off") => {
    client.publish("greenhouse/fan", action);
  };

  const handleLightControl = (action: "on" | "off") => {
    client.publish("greenhouse/light", action);
  };

  return (
    <div>
      <Typography variant="h5">Control Panel</Typography>
      <Button variant="contained" onClick={() => handleFanControl("on")}>
        Turn On Fan
      </Button>
      <Button variant="contained" onClick={() => handleFanControl("off")}>
        Turn Off Fan
      </Button>
      <Button variant="contained" onClick={() => handleLightControl("on")}>
        Turn On Light
      </Button>
      <Button variant="contained" onClick={() => handleLightControl("off")}>
        Turn Off Light
      </Button>
      {/* Add more control buttons as needed */}
    </div>
  );
};

export default ControlPanel;

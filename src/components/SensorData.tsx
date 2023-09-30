import { Typography } from "@mui/material";

type SensorDataProps = {
  humidity: number;
  temperature: number;
  light: number;
  atmospheric_pressure: number;
  PM_2_5: number;
  soil_temperature: number;
  soil_moisture: number;
  fan_status: string;
  fill_light_status: string;
  heater_status: string;
  sprinkler_pump_status: string;
  string_sunshade_status: string;
};

type Props = {
  data: SensorDataProps;
};

const SensorData = ({ data }: Props) => {
  const { temperature, humidity } = data;

  return (
    <div>
      <Typography variant="h5">Sensor Data</Typography>
      <Typography variant="body1">
        Temperature: {Math.floor(temperature)} °C
      </Typography>
      <Typography variant="body1">
        Humidity: {Math.floor(humidity)} %
      </Typography>
      {/* Add more sensor data elements here */}
    </div>
  );
};

export default SensorData;

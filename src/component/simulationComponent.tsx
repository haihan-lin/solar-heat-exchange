import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { SVGWidth, SVGHeight } from "../preset/constants";
import "./simulationComponent.css";
import { blue, red } from "@mui/material/colors";
import { Slider, Typography } from "@mui/material";
import Store from "../interface/appStore";
import SimulationSVG from "./simulationSVG";

const SimulationComponent: FC = () => {
  const store = useContext(Store);
  const [panelArea, setPanelArea] = useState(2);
  const [solarIrradiance, setSolarIrradiance] = useState(600);
  const [efficiency, setEfficiency] = useState(0.6);
  const [tankStartingTemp, setTankStartingTemp] = useState(25);
  const [finalTemp, setFinalTemp] = useState(0);
  useEffect(() => {
    const finalTemp = tankStartingTemp + (solarIrradiance * panelArea * efficiency * 8 * 3600) / (200 * 1 * 4186);
    setFinalTemp(finalTemp > 100 ? 100 : finalTemp);
  }, [panelArea, solarIrradiance, efficiency, tankStartingTemp]);

  const solarIrradianceMarks = [
    {
      value: 100,
      label: 'Very little',
    },
    {
      value: 300,
      label: 'Little',
    },
    {
      value: 550,
      label: 'Moderate',
    },
    {
      value: 800,
      label: 'Bright',
    },
    {
      value: 1000,
      label: 'Very bright',
    },
  ];

  return (
    <div className="simulation-container">

      <div style={{ marginLeft: '50px', marginRight: '50px' }}>
        <div className="slider-container">
          Panel Area (m²)
          <Slider
            size="small"
            defaultValue={2}
            min={1}
            max={10}
            onChange={(e: any) => e.target && e.target.value && setPanelArea(e.target.value)}
            valueLabelDisplay="on"
            className="slider"

          />
        </div>
        <div className="slider-container">
          How bright the sun is (Solar Irradiance W/m²)
          <Slider
            size="small"
            defaultValue={600}
            valueLabelDisplay="on"
            onChange={(e: any) => e.target.value && setSolarIrradiance(Number(e.target.value))}
            marks={solarIrradianceMarks}
            step={50}
            min={100}
            className="slider"

            max={1000}
          />
        </div>
        <div className="slider-container">
          How effective the system is (%)
          <Slider
            className="slider"
            size="small"
            defaultValue={60}
            valueLabelDisplay="on"
            step={5}
            onChange={(e: any) => e.target.value && setEfficiency(Number(e.target.value * 0.01))}
            min={0}
            max={100}
          />
        </div>
        <div className="slider-container">
          Tank Starting Temperature (°C)
          <Slider
            size="small"
            defaultValue={25}
            valueLabelDisplay="on"
            onChange={(e: any) => e.target.value && setTankStartingTemp(Number(e.target.value))}
            step={1}
            min={0}
            className="slider"

            max={100}
          />
        </div>
        <Typography variant="caption">
          Assumptions: 200L Tank size after an 8-hour sunny day.
        </Typography>
      </div >
      <SimulationSVG waterTemperature={finalTemp} />

    </div>
  );

};
export default observer(SimulationComponent);

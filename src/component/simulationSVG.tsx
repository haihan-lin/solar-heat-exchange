import { FC, useCallback, useEffect } from "react";
import { SVGWidth, SVGHeight } from "../preset/constants";
import { scaleLinear } from "d3-scale";
import { interpolate, interpolateRgb } from "d3-interpolate";
import { blue, grey, red } from "@mui/material/colors";

type Props = {
  waterTemperature: number;
};

const SimulationSVG: FC<Props> = ({ waterTemperature }: Props
) => {



  const colorScale = useCallback(() => {
    return scaleLinear().domain([0, 50, 100]).range(['blue', 'white', 'red'] as any);
  }, []);

  useEffect(() => {
    console.log('Rendering Simulation SVG with water temperature:', colorScale()(waterTemperature));
  });
  return (
    <svg width={SVGWidth} height={SVGHeight} style={{ background: '#ebf1f5' }} >
      <line x1="200" y1="210" x2="300" y2="210" stroke="#c69c6d" strokeWidth="3" />
      <line x1="340" y1="210" x2="420" y2="210" stroke="#c69c6d" strokeWidth="3" />
      <line x1="200" y1="260" x2="420" y2="260" stroke="#c69c6d" strokeWidth="3" />
      {/* Solar Panel */}
      <g transform="scale(0.3,0.3) translate(200,500)">
        <path d="M77.604,241.753l10.047-41.623c-21.697-9.842-38.879-39.91-38.879-65.383c0-40.4,32.761-73.162,73.162-73.162
		c31.978,0,59.097,20.563,69.049,49.153h28.136c4.574-7.435,17.672-17.408,15.484-22.67c-2.766-6.681-27.566-1.566-31.546-7.515
		c-4.003-5.979,10.172-26.951,5.1-32.022c-5.078-5.078-26.05,9.104-32.029,5.093c-5.941-3.973-0.834-28.788-7.508-31.553
		c-6.572-2.722-20.497,18.396-27.639,16.984c-6.922-1.368-11.723-26.241-19.048-26.241c-7.325,0-12.126,24.873-19.048,26.241
		c-7.134,1.412-21.06-19.706-27.631-16.977c-6.681,2.766-1.566,27.566-7.515,31.546c-5.979,4.003-26.951-10.171-32.022-5.1
		c-5.078,5.078,9.104,26.05,5.101,32.029c-3.98,5.942-28.788,0.834-31.561,7.508c-2.722,6.572,18.397,20.504,16.984,27.639
		C24.873,122.622,0,127.423,0,134.747c0,7.325,24.873,12.126,26.242,19.048c1.412,7.134-19.707,21.06-16.977,27.631
		c2.766,6.681,27.565,1.566,31.546,7.515c4.003,5.979-10.171,26.951-5.1,32.022c5.078,5.078,26.05-9.104,32.029-5.101
		C71.464,218.358,76.938,233.447,77.604,241.753z"/>
        <path d="M66.144,349.022H512l-52.453-217.304h-340.95L66.144,349.022z M473.934,319.049H367.579L361.3,251.61h96.351
		L473.934,319.049z M435.948,161.691l16.282,67.439h-93.022l-6.271-67.439H435.948z M247.644,161.691h82.718l6.278,67.439h-95.275
		L247.644,161.691z M239.272,251.61h99.46l6.271,67.439H233.001L239.272,251.61z M142.204,161.691h82.865l-6.271,67.439h-92.876
		L142.204,161.691z M216.705,251.61l-6.279,67.439H104.218L120.5,251.61H216.705z"/>
        <polygon points="83.634,394.479 494.511,394.479 512,359.508 66.144,359.508 	" />
        <polygon points="311.702,408.668 266.449,408.668 264.02,448.271 218.358,470.897 218.358,499.187 359.794,499.187
		359.794,470.897 314.131,448.271 	"/>
      </g>

      {/* Pump */}
      <circle cx="320" cy="210" r="15" fill="#6b2d10" stroke="#3c1b08" strokeWidth="2" />
      <rect x="300" y="200" width="40" height="20" fill="#8c3d12" stroke="#3c1b08" strokeWidth="2" />
      <text x="320" y="210" fontSize="12" fill="#FFF"
        textAnchor="middle" alignmentBaseline="middle">Pump</text>

      {/* Storage Tank */}
      <rect x="420" y="130" width="80" height="160" rx="40" ry="40"
        fill={colorScale()(waterTemperature) as any}
        stroke="#555" />
      <text x="430" y="310" fontSize="12" fill={grey[800]}>Storage Tank</text>
      <text
        x="460" y="200" fontSize="14" fill={grey[800]}
        textAnchor="middle" alignmentBaseline="middle"
      >Water Temp</text>
      <text
        x="460" y="220" fontSize="14" fill={grey[800]}
        textAnchor="middle" alignmentBaseline="middle"
      >
        {waterTemperature.toFixed(1)}°C
      </text>

    </svg >
  );
};


export default SimulationSVG;

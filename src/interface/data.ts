import { createContext } from 'react';

export type SolarDataType = {
  timeStamps: Date[],
  dateOnlyTimeStamps: Date[],
  solarIrradiance: number[],
  panelInletTemp: number[],
  panelOutletTemp: number[],
  pumpFlowRate: number[],
  tankTemp: number[],
  ambientTemp: number[];
};

export const DataContext = createContext<SolarDataType>({
  timeStamps: [],
  dateOnlyTimeStamps: [],
  solarIrradiance: [],
  panelInletTemp: [],
  panelOutletTemp: [],
  pumpFlowRate: [],
  tankTemp: [],
  ambientTemp: []
});

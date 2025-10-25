import { createContext, useContext, useEffect, useState } from 'react';

export const DataContext = createContext({
  timeStamp: [],
  solarIrradiance: [],
  panelInletTemp: [],
  panelOutletTemp: [],
  pumpFlowRate: [],
  tankTemp: [],
  ambientTemp: []
});

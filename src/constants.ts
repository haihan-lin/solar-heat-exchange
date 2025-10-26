import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';


export const linkToData = 'generated_solar_data.csv';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#E0C2FF',
      // contrastText: '#ffffff',
    },
  },
});

export const SVGWidth = 600;
export const SVGHeight = 400;
export const margin = { top: 20, right: 30, bottom: 30, left: 40 };

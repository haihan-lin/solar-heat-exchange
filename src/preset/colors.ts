import { createTheme } from '@mui/material/styles';
import { grey, purple } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: purple[100],
      contrastText: grey[900],
    },
  },
});

export const LineColor = purple[900];

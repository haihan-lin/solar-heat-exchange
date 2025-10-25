import React from 'react';
import logo from './logo.svg';
import './App.css';
import { observer } from 'mobx-react-lite';
import { AppBar } from '@mui/material';

function App() {
  return (
    <div className="App">
      <AppBar position="static" style={{ maxHeight: '40px', minHeight: '40px', justifyContent: 'center' }}>
      </AppBar>

    </div >
  );
}

export default observer(App);

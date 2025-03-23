import React from 'react';
import PublicContextProvider from './Dashboard/context/publicContext';
import Home from './Dashboard/Home';

function App() {
  return (
  
      <PublicContextProvider> 
        <Home/>
        </PublicContextProvider> 
   
  );
}

export default App;

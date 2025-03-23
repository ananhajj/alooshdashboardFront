import React from 'react';

import Home from './Dashboard/Home';
import PublicContextProvider from './Dashboard/context/PublicContext';

function App() {
  return (
  
      <PublicContextProvider> 
        <Home/>
        </PublicContextProvider> 
   
  );
}

export default App;

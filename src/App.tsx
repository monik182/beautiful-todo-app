import React from 'react';
import './App.css';
import { Provider } from './components/ui/provider';
import { SessionProvider } from './SessionProvider';
import { Layout } from './Layout';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Provider>
        <SessionProvider>
          <Routes>
            <Route path="/" element={<Layout />} />
          </Routes>
        </SessionProvider>
      </Provider>
    </Router>
  );
}

export default App;

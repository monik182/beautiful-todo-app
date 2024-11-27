import React from 'react';
import './App.css';
import { Provider } from './components/ui/provider';
import { SessionProvider } from './SessionProvider';
import { Layout } from './Layout';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Home, NotePreview } from './pages';

function App() {
  return (
    <Router>
      <Provider>
        <SessionProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/note" element={<NotePreview />} />
            </Routes>
          </Layout>
        </SessionProvider>
      </Provider>
    </Router>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AppProvider } from './AppContext';
import './index.css';

// ✅ React Router
import { BrowserRouter } from 'react-router-dom';

// ✅ Toasts
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Wrap App in Router */}
      <AppProvider>
        <App />
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          theme="colored"
        />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);

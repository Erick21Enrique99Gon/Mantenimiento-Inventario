import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from './redux/Store';
import App from './App';
import './data';
// import * as serviceWorker from './serviceWorker';
// import reportWebVitals from './reportWebVitals';
import Spinner from './views/spinner/Spinner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={configureStore()}>
  <Suspense fallback={<Spinner />}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Suspense>
</Provider>
)

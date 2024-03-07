import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

// import axiosInstance from './api/AxiosInstance';
// import MockAdapter from 'axios-mock-adapter';

// const mock = new MockAdapter(axiosInstance);
// console.log("Starting mock adapters");

// mock.onPost('/login').reply(200, {
//   message: 'Login successful',
//   token: 'fake-jwt-token',
// });

// mock.onPost('/signup').reply(200, {
//   message: 'Signup successful',
//   token: 'fake-jwt-token',
// });


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

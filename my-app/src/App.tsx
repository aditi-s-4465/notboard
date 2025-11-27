import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Login from "./pages/login/login";
import Createaccount from "./pages/createaccount/createaccount";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/create" element={<Createaccount/>} />
      </Routes>
    </Router>
  );
}


export default App;

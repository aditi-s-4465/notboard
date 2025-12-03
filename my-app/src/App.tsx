import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Login from "./pages/login/login";
import Createaccount from "./pages/createaccount/createaccount";
import Choosecollection from "./pages/choosecollection/choosecollection";
import Showcollection from "./pages/showcollection/showcollection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/create" element={<Createaccount/>} />
        <Route path="/choosecollection" element={<Choosecollection/>}/>
        <Route path="/showcollection" element={<Showcollection/>}/>
      </Routes>
    </Router>
  );
}


export default App;

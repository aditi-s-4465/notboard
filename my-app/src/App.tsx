import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Login from "./pages/login/login";
import Createaccount from "./pages/createaccount/createaccount";
import Choosecollection from "./pages/choosecollection/choosecollection";
import Showcollection from "./pages/showcollection/showcollection";
import Addgame from "./pages/addgame/addgame";
import { AppProvider } from './context/appcontext'


function App() {
  return (
    <AppProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/create" element={<Createaccount/>} />
          <Route path="/choosecollection" element={<Choosecollection/>}/>
          <Route path="/showcollection" element={<Showcollection/>}/>
          <Route path="/addgame" element={<Addgame/>}/>
        </Routes>
      </Router>
    </AppProvider>
  );
}


export default App;

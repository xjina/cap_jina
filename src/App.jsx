import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import TimetableResult from "./components/TimetableResult/TimetableResult";
import TimetableForm from "./components/TimetableFrom/TimetableForm";

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<TimetableForm />} />
          <Route path="/result" element={<TimetableResult />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

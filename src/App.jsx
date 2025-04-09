import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import TimetableForm from './components/TimetableForm'
import TimetableResult from './components/TimetableResult/TimetableResult'

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
  )
}

export default App
import React from 'react'
import Header from './components/Header'
import TimetableForm from './components/TimetableForm'

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-kmu-blue mb-2">시간표 자동 생성</h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">원하는 조건을 선택하시면 최적의 시간표를 추천해드립니다.</p>
        </div>
        
        <TimetableForm />
      </main>
    </div>
  )
}

export default App 
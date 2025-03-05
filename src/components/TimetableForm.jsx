import React, { useState } from 'react'

const TimetableForm = () => {
  const [formData, setFormData] = useState({
    year: '1',
    semester: '1',
    department: 'computer',
    majorCredits: '3',
    generalCredits: '3'
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 여기서 API 호출 또는 다른 처리를 수행할 수 있습니다.
    console.log('제출된 데이터:', formData)
    alert('시간표 생성 요청이 제출되었습니다.')
  }

  // 학점 옵션 배열
  const creditOptions = [3, 6, 9, 12, 15, 18]

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
      <form onSubmit={handleSubmit}>
        {/* 첫 번째 폼 그룹 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="space-y-2">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">학년</label>
            <select 
              id="year" 
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-kmu-blue focus:ring focus:ring-blue-200 transition duration-200 text-sm sm:text-base"
              value={formData.year}
              onChange={handleChange}
            >
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700">학기</label>
            <select 
              id="semester" 
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-kmu-blue focus:ring focus:ring-blue-200 transition duration-200 text-sm sm:text-base"
              value={formData.semester}
              onChange={handleChange}
            >
              <option value="1">1학기</option>
              <option value="2">2학기</option>
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2 md:col-span-1">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">학과</label>
            <select 
              id="department" 
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-kmu-blue focus:ring focus:ring-blue-200 transition duration-200 text-sm sm:text-base"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="computer">컴퓨터공학과</option>
              <option value="software">소프트웨어학과</option>
              <option value="ai">인공지능학과</option>
            </select>
          </div>
        </div>

        {/* 두 번째 폼 그룹 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-10">
          <div className="space-y-2">
            <label htmlFor="majorCredits" className="block text-sm font-medium text-gray-700">전공학점</label>
            <select 
              id="majorCredits" 
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-kmu-blue focus:ring focus:ring-blue-200 transition duration-200 text-sm sm:text-base"
              value={formData.majorCredits}
              onChange={handleChange}
            >
              {creditOptions.map(credit => (
                <option key={`major-${credit}`} value={credit}>{credit}학점</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="generalCredits" className="block text-sm font-medium text-gray-700">교양학점</label>
            <select 
              id="generalCredits" 
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-kmu-blue focus:ring focus:ring-blue-200 transition duration-200 text-sm sm:text-base"
              value={formData.generalCredits}
              onChange={handleChange}
            >
              {creditOptions.map(credit => (
                <option key={`general-${credit}`} value={credit}>{credit}학점</option>
              ))}
            </select>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-center">
          <button 
            type="submit" 
            className="bg-kmu-blue text-white px-6 sm:px-8 md:px-10 py-2 sm:py-3 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium text-base sm:text-lg"
          >
            시간표 추천
          </button>
        </div>
      </form>
    </div>
  )
}

export default TimetableForm 
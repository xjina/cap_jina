import React, { useState, useEffect, useRef } from 'react'

const TimetableForm = () => {
  const [formData, setFormData] = useState({
    year: '1',
    semester: '1',
    department: 'computer',
    majorCredits: '3',
    generalCredits: '3'
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [selectedDeptTemp, setSelectedDeptTemp] = useState(null) // 임시 선택 상태
  const closeTimeoutRef = useRef(null)

  // 단과대학 및 학과 데이터
  const collegesAndDepartments = [
    {
      id: 'engineering',
      name: '공과대학',
      departments: [
        { value: 'computer', label: '컴퓨터공학과' },
        { value: 'software', label: '소프트웨어학과' },
        { value: 'ai', label: '인공지능학과' },
        { value: 'electronic', label: '전자공학과' },
        { value: 'mechanical', label: '기계공학과' }
      ]
    },
    {
      id: 'business',
      name: '경영대학',
      departments: [
        { value: 'business', label: '경영학과' },
        { value: 'accounting', label: '회계학과' },
        { value: 'international', label: '국제통상학과' }
      ]
    },
    {
      id: 'social',
      name: '사회과학대학',
      departments: [
        { value: 'psychology', label: '심리학과' },
        { value: 'sociology', label: '사회학과' },
        { value: 'media', label: '미디어커뮤니케이션학과' }
      ]
    }
  ]

  // 현재 선택된 학과 정보 가져오기
  const getCurrentDepartmentLabel = () => {
    for (const college of collegesAndDepartments) {
      const dept = college.departments.find(d => d.value === formData.department)
      if (dept) return dept.label
    }
    return '학과 선택'
  }

  // 현재 선택된 학과의 단과대학 ID 가져오기
  const getCurrentCollegeId = () => {
    for (const college of collegesAndDepartments) {
      const dept = college.departments.find(d => d.value === formData.department)
      if (dept) return college.id
    }
    return null
  }

  const handleButtonSelect = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 여기서 API 호출 또는 다른 처리를 수행할 수 있습니다.
    console.log('제출된 데이터:', formData)
    alert('시간표 생성 요청이 제출되었습니다.')
  }

  const openModal = () => {
    setIsModalOpen(true)
    // 현재 선택된 학과의 단과대학으로 초기화
    const currentCollegeId = getCurrentCollegeId()
    setSelectedCollege(currentCollegeId)
    setSelectedDeptTemp(formData.department)
  }

  const closeModal = () => {
    setIsClosing(true)
    
    closeTimeoutRef.current = setTimeout(() => {
      setIsModalOpen(false)
      setIsClosing(false)
      setSelectedDeptTemp(null)
    }, 300)
  }

  const selectCollege = (collegeId) => {
    setSelectedCollege(collegeId)
  }

  const selectDepartment = (deptValue) => {
    setSelectedDeptTemp(deptValue) // 임시 선택 상태 업데이트
    
    // 선택 효과를 위한 지연
    setTimeout(() => {
      handleButtonSelect('department', deptValue)
      closeModal()
    }, 150)
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // 모달이 열렸을 때 스크롤 방지
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isModalOpen])

  // 학점 옵션 배열
  const creditOptions = [3, 6, 9, 12, 15, 18]

  // 버튼 스타일 클래스
  const getButtonClass = (currentValue, buttonValue) => {
    return `py-2 px-3 rounded-md text-center transition-all duration-200 font-medium 
      ${currentValue === buttonValue
        ? 'bg-kmu-blue text-white shadow-md'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
      }`
  }

  // 단과대학 버튼 스타일
  const getCollegeButtonClass = (collegeId) => {
    const isSelected = selectedCollege === collegeId
    return `w-full py-3 px-4 rounded-lg text-left font-medium transition-all duration-200 flex justify-between items-center
      ${isSelected 
        ? 'bg-blue-50 border-l-4 border-kmu-blue shadow-sm' 
        : 'bg-gray-50 hover:bg-gray-100'}`
  }

  // 학과 버튼 스타일
  const getDepartmentButtonClass = (deptValue) => {
    const isSelected = selectedDeptTemp === deptValue || formData.department === deptValue
    return `w-full py-3 px-4 rounded-lg text-left font-medium transition-all duration-200
      ${isSelected
        ? 'bg-kmu-blue text-white shadow-md'
        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow'
      }`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
      <form onSubmit={handleSubmit}>
        {/* 학년 버튼 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">학년</label>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((year) => (
              <button
                key={`year-${year}`}
                type="button"
                className={getButtonClass(formData.year, String(year))}
                onClick={() => handleButtonSelect('year', String(year))}
              >
                {year}학년
              </button>
            ))}
          </div>
        </div>

        {/* 학기 버튼 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">학기</label>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((semester) => (
              <button
                key={`semester-${semester}`}
                type="button"
                className={getButtonClass(formData.semester, String(semester))}
                onClick={() => handleButtonSelect('semester', String(semester))}
              >
                {semester}학기
              </button>
            ))}
          </div>
        </div>

        {/* 학과 선택 버튼 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">학과</label>
          <button
            type="button"
            onClick={openModal}
            className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-kmu-blue focus:border-kmu-blue transition-all duration-200 flex justify-between items-center"
          >
            <span>{getCurrentDepartmentLabel()}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* 전공학점 버튼 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">전공학점</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {creditOptions.map((credit) => (
              <button
                key={`major-${credit}`}
                type="button"
                className={getButtonClass(formData.majorCredits, String(credit))}
                onClick={() => handleButtonSelect('majorCredits', String(credit))}
              >
                {credit}학점
              </button>
            ))}
          </div>
        </div>

        {/* 교양학점 버튼 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">교양학점</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {creditOptions.map((credit) => (
              <button
                key={`general-${credit}`}
                type="button"
                className={getButtonClass(formData.generalCredits, String(credit))}
                onClick={() => handleButtonSelect('generalCredits', String(credit))}
              >
                {credit}학점
              </button>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-center">
          <button 
            type="submit" 
            className="bg-kmu-blue text-white px-6 sm:px-8 md:px-10 py-3 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium text-base sm:text-lg shadow-md hover:shadow-lg"
          >
            시간표 추천
          </button>
        </div>
      </form>

      {/* 학과 선택 모달 */}
      {isModalOpen && (
        <>
          {/* 배경 오버레이 */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 modal-overlay ${isClosing ? 'closing' : ''}`}
            onClick={closeModal}
          ></div>
          
          {/* 모달 내용 */}
          <div className={`fixed inset-x-0 bottom-0 max-h-[80vh] bg-white rounded-t-xl shadow-xl z-50 ${isClosing ? 'closing' : ''}`}>
            <div className="flex flex-col h-full max-h-[80vh]">
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-kmu-blue">
                  {selectedCollege ? '학과 선택' : '단과대학 선택'}
                </h3>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                  aria-label="닫기"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {!selectedCollege ? (
                  // 단과대학 목록
                  <div className="grid grid-cols-1 gap-3">
                    {collegesAndDepartments.map((college) => (
                      <button
                        key={college.id}
                        type="button"
                        className={getCollegeButtonClass(college.id)}
                        onClick={() => selectCollege(college.id)}
                      >
                        <span>{college.name}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    ))}
                  </div>
                ) : (
                  // 선택된 단과대학의 학과 목록
                  <div className="grid grid-cols-1 gap-3">
                    {collegesAndDepartments.find(c => c.id === selectedCollege)?.departments.map((dept) => (
                      <button
                        key={dept.value}
                        type="button"
                        className={getDepartmentButtonClass(dept.value)}
                        onClick={() => selectDepartment(dept.value)}
                      >
                        {dept.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedCollege && (
                <div className="p-4 border-t sticky bottom-0 bg-white">
                  <button
                    type="button"
                    className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
                    onClick={() => setSelectedCollege(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    단과대학 선택으로 돌아가기
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TimetableForm 
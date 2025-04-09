import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'  // 추가
import './TimetableForm.css'
import DepartmentModal from './DepartmentModal/DepartmentModal'

const TimetableForm = () => {
  const navigate = useNavigate()  // 추가
  const [formData, setFormData] = useState({
    year: '2', // 1학년에서 2학년으로 변경
    semester: '1',
    department: '',
    departmentLabel: '학과 선택', // 학과 이름 표시용
    majorCredits: '3',
    generalCredits: '3',
    generalAreas: [] // 선택된 교양 영역들을 저장할 배열
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

  // 교양 영역 데이터 추가
  const generalAreas = [
    { id: 'literature', name: '문학과예술' },
    { id: 'society', name: '사회와문화' },
    { id: 'global', name: '글로벌리더십' },
    { id: 'science', name: '과학과기술' },
    { id: 'career', name: '진로탐색/자기개발/창업' },
    { id: 'philosophy', name: '철학과역사' }
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

  // 학점 제한 검사 함수 추가
  const checkTotalCredits = (majorCredits, generalCredits) => {
    const total = Number(majorCredits) + Number(generalCredits)
    return total <= 20
  }

  const handleButtonSelect = (field, value) => {
    if (field === 'majorCredits') {
      const wouldBeValid = checkTotalCredits(value, formData.generalCredits)
      if (!wouldBeValid) {
        alert('전공학점과 교양학점의 합이 20학점을 초과할 수 없습니다.')
        return
      }
    }
    
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 유효성 검사
    if (!formData.department) {
      alert('학과를 선택해주세요.')
      return
    }
    
    if (formData.generalCredits !== '0' && formData.generalAreas.length === 0) {
      alert('교양 학점을 선택했다면 최소 1개 이상의 교양 영역을 선택해주세요.')
      return
    }
    
    // 결과 페이지로 이동하면서 데이터 전달
    navigate('/result', { state: formData })
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

  // 교양 영역 처리 함수 추가
  const handleGeneralAreaToggle = (areaId) => {
    setFormData(prevState => {
      const maxAreas = getMaxSelectableAreas(prevState.generalCredits)
      const isSelected = prevState.generalAreas.includes(areaId)

      // 이미 선택된 경우는 항상 제거 가능
      if (isSelected) {
        return {
          ...prevState,
          generalAreas: prevState.generalAreas.filter(id => id !== areaId)
        }
      }

      // 새로 선택하는 경우, 최대 선택 가능 개수 확인
      if (prevState.generalAreas.length >= maxAreas) {
        alert(`교양 ${prevState.generalCredits}학점은 최대 ${maxAreas}개 영역까지 선택 가능합니다.`)
        return prevState
      }

      return {
        ...prevState,
        generalAreas: [...prevState.generalAreas, areaId]
      }
    })
  }

  // 교양 영역 선택 여부 확인 함수
  const isGeneralAreaSelected = (areaId) => {
    return formData.generalAreas.includes(areaId)
  }

  // 교양학점에 따른 최대 선택 가능한 영역 수 계산
  const getMaxSelectableAreas = (credits) => {
    return Math.min(Math.floor(Number(credits) / 3), 6)
  }

  // 교양학점 변경 시 선택된 영역 검사
  const handleGeneralCreditsChange = (credits) => {
    const wouldBeValid = checkTotalCredits(formData.majorCredits, credits)
    if (!wouldBeValid) {
      alert('전공학점과 교양학점의 합이 20학점을 초과할 수 없습니다.')
      return
    }

    const maxAreas = getMaxSelectableAreas(credits)
    
    setFormData(prevState => {
      // 현재 선택된 영역이 새로운 최대 개수를 초과하는 경우
      if (prevState.generalAreas.length > maxAreas) {
        alert(`교양 ${credits}학점은 최대 ${maxAreas}개 영역까지 선택 가능합니다.\n초과 선택된 영역이 초기화됩니다.`)
        return {
          ...prevState,
          generalCredits: credits,
          generalAreas: prevState.generalAreas.slice(0, maxAreas)
        }
      }

      return {
        ...prevState,
        generalCredits: credits
      }
    })
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
    return `button ${currentValue === buttonValue ? 'button-active' : 'button-inactive'}`
  }

  // 단과대학 버튼 스타일
  const getCollegeButtonClass = (collegeId) => {
    const isSelected = selectedCollege === collegeId
    return `college-button ${isSelected ? 'college-button-active' : ''}`
  }

  // 학과 버튼 스타일
  const getDepartmentButtonClass = (deptValue) => {
    const isSelected = selectedDeptTemp === deptValue || formData.department === deptValue
    return `department-button ${isSelected ? 'department-button-active' : ''}`
  }

  const handleDepartmentSelect = (deptValue, deptLabel) => {
    setFormData(prevState => ({
      ...prevState,
      department: deptValue,
      departmentLabel: deptLabel
    }))
  }

  return (
    <main className="timetable-main">
      <div className="timetable-header">
        <h1 className="timetable-title">시간표 자동 생성</h1>
        <p className="timetable-description">원하는 조건을 선택하시면 최적의 시간표를 추천해드립니다.</p>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* 학년 버튼 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">학년</label>
            <div className="grid grid-cols-3 gap-3"> {/* grid-cols-4에서 grid-cols-3으로 변경 */}
              {[2, 3, 4].map((year) => ( // 1 제거, [2,3,4]만 매핑
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
              onClick={() => setIsModalOpen(true)}
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

          {/* 교양학점 섹션 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">교양학점</label>
            {/* 교양학점 수 선택 */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
              {creditOptions.map((credit) => (
                <button
                  key={`general-${credit}`}
                  type="button"
                  className={getButtonClass(formData.generalCredits, String(credit))}
                  onClick={() => handleGeneralCreditsChange(String(credit))}
                >
                  {credit}학점
                </button>
              ))}
            </div>
            
            {/* 교양 영역 선택 */}
            <label className="block text-sm font-medium text-gray-700 mb-3">교양 영역 선택</label>
            <div className="grid grid-cols-2 gap-3">
              {generalAreas.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  className={`text-left px-4 py-3 rounded-md border ${
                    isGeneralAreaSelected(area.id)
                      ? 'border-kmu-blue bg-blue-50 text-kmu-blue'
                      : 'border-gray-300 hover:bg-gray-50'
                  } transition-all duration-200`}
                  onClick={() => handleGeneralAreaToggle(area.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 border rounded mr-3 ${
                      isGeneralAreaSelected(area.id)
                        ? 'bg-kmu-blue border-kmu-blue'
                        : 'border-gray-400'
                    }`}>
                      {isGeneralAreaSelected(area.id) && (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {area.name}
                  </div>
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
        <DepartmentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectDepartment={handleDepartmentSelect}
          currentDepartment={formData.department}
        />
      </div>
    </main>
  )
}

export default TimetableForm
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './TimetableForm.css'
import DepartmentModal from './DepartmentModal/DepartmentModal'

// API 기본 URL 설정
const API_URL = 'https://kmutime.duckdns.org/api/timetable'

const TimetableForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    year: '2',
    semester: '1',
    department: '',
    departmentLabel: '학과 선택',
    majorCredits: '3',
    generalCredits: '3',
    generalAreas: []
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [selectedDeptTemp, setSelectedDeptTemp] = useState(null)
  const closeTimeoutRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  // 단과대학 및 학과 데이터
  const collegesAndDepartments = [
    {
      id: 'humanities',
      name: '인문국제학대학',
      departments: [
        { value: 'korean', label: '국어국문학과' },
        { value: 'koreanEdu', label: '한국어교육과' },
        { value: 'american', label: '미국학전공' },
        { value: 'english', label: '영어영문학과' },
        { value: 'german', label: '독일유럽학과' },
        { value: 'chinese', label: '중국어중국학과' },
        { value: 'japanese', label: '일본어일본학과' },
        { value: 'russian', label: '러시아중앙아시아학과' },
        { value: 'spanish', label: '스페인어중남미학과' },
        { value: 'history', label: '사학과' },
        { value: 'christian', label: '기독교학과' },
        { value: 'philosophy', label: '철학과' },
        { value: 'creative', label: '문예창작학과' }
      ]
    },
    {
      id: 'education',
      name: '사범대학',
      departments: [
        { value: 'education', label: '교육학과' },
        { value: 'chineseEdu', label: '한문교육과' },
        { value: 'earlyEdu', label: '유아교육과' },
        { value: 'englishEdu', label: '영어교육과' },
        { value: 'koreanEdu', label: '국어교육과' }
      ]
    },
    {
      id: 'business',
      name: '경영대학',
      departments: [
        { value: 'business', label: '경영학과' },
        { value: 'tourism', label: '관광경영학과' },
        { value: 'accounting', label: '회계학과' },
        { value: 'tax', label: '세무학과' },
        { value: 'mis', label: '경영정보학과' },
        { value: 'bigdata', label: '경영빅데이터학과' }
      ]
    },
    {
      id: 'social',
      name: '사회과학대학',
      departments: [
        { value: 'economics', label: '경제금융학과' },
        { value: 'trade', label: '국제통상학과' },
        { value: 'public', label: '행정학과' },
        { value: 'politics', label: '정치외교학과' },
        { value: 'media', label: '언론영상학과' },
        { value: 'advertising', label: '광고홍보학과' },
        { value: 'sociology', label: '사회학과' },
        { value: 'psychology', label: '심리학과' },
        { value: 'library', label: '문헌정보학과' },
        { value: 'welfare', label: '사회복지학과' },
        { value: 'law', label: '법학과' },
        { value: 'police', label: '경찰행정학과' }
      ]
    },
    {
      id: 'science',
      name: '자연과학대학',
      departments: [
        { value: 'math', label: '수학과' },
        { value: 'statistics', label: '통계학과' },
        { value: 'chemistry', label: '화학과' },
        { value: 'biology', label: '생명과학과' },
        { value: 'health', label: '공중보건학과' },
        { value: 'foodProcess', label: '식품가공학과' },
        { value: 'nutrition', label: '식품영양학과' }
      ]
    },
    {
      id: 'engineering',
      name: '공과대학',
      departments: [
        { value: 'civil', label: '토목공학과' },
        { value: 'architecture', label: '건축학과' },
        { value: 'architecturalEng', label: '건축공학과' },
        { value: 'electronic', label: '전자공학과' },
        { value: 'electrical', label: '전기에너지공학과' },
        { value: 'computer', label: '컴퓨터공학과' },
        { value: 'game', label: '게임소프트웨어학과' },
        { value: 'digipen', label: '디지펜게임공학과' },
        { value: 'traffic', label: '교통공학과' },
        { value: 'urban', label: '도시계획학과' },
        { value: 'landscape', label: '생태조경학과' },
        { value: 'mechanical', label: '기계공학과' },
        { value: 'automotive', label: '자동차공학과' },
        { value: 'robot', label: '로봇공학과' },
        { value: 'smartManufacturing', label: '스마트제조공학과' },
        { value: 'chemicalEng', label: '화학공학과' },
        { value: 'materials', label: '신소재공학과' },
        { value: 'industrial', label: '산업공학과' },
        { value: 'biomedical', label: '의용공학과' },
        { value: 'environmental', label: '환경공학과' }
      ]
    },
    {
      id: 'nursing',
      name: '간호대학',
      departments: [
        { value: 'nursing', label: '간호학과' }
      ]
    },
    {
      id: 'physical',
      name: '체육대학',
      departments: [
        { value: 'physical', label: '체육학과' },
        { value: 'sport', label: '사회체육학과' },
        { value: 'silver', label: '실버스포츠복지학과' },
        { value: 'taekwondo', label: '태권도학과' },
        { value: 'sportMarketing', label: '스포츠마케팅학과' }
      ]
    },
    {
      id: 'pharmacy',
      name: '약학대학',
      departments: [
        { value: 'pharmacy', label: '약학과' },
        { value: 'pharmaceutical', label: '제약학과' }
      ]
    }
  ]

  // 교양 영역 데이터
  const generalAreas = [
    { id: 'literature', name: '문학과예술' },
    { id: 'society', name: '사회와문화' },
    { id: 'global', name: '글로벌리더십' },
    { id: 'science', name: '과학과기술' },
    { id: 'career', name: '진로탐색/자기계발/창업' },
    { id: 'philosophy', name: '철학과역사' },
    { id: 'remote', name: '원격 강의 희망' }
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

  // 학점 제한 검사 함수
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

  // 교양 영역 ID를 서버가 이해할 수 있는 이름으로 변환하는 함수
  const mapAreaIdToName = (areaId) => {
    const areaMap = {
      'literature': '문학과예술',
      'society': '사회와문화',
      'global': '글로벌리더십',
      'science': '과학과기술',
      'career': '진로탐색/자기계발/창업',
      'philosophy': '철학과역사',
      'remote': '원격 강의 희망'
    }
    return areaMap[areaId] || areaId
  }

  // handleSubmit 함수 수정
const handleSubmit = async (e) => {
  e.preventDefault()
  
  // 유효성 검사
  if (!formData.department) {
    alert('학과를 선택해주세요.')
    return
  }
  
  // 전공과 교양 모두 0학점인 경우 체크
  if (formData.majorCredits === '0' && formData.generalCredits === '0') {
    alert('전공 또는 교양 학점을 선택해주세요.')
    return
  }
  
  // 교양 학점이 있는데 영역을 선택하지 않은 경우
  if (formData.generalCredits !== '0' && formData.generalAreas.length === 0) {
    alert('교양 학점을 선택했다면 최소 1개 이상의 교양 영역을 선택해주세요.')
    return
  }

  setIsLoading(true)
  
  try {
    const serverData = {
      department: getCurrentDepartmentLabel(),
      grade: parseInt(formData.year),
      semester: parseInt(formData.semester),
      majorCredits: parseInt(formData.majorCredits),
      liberalCredits: parseInt(formData.generalCredits),
      liberalAreas: formData.generalAreas.map(areaId => mapAreaIdToName(areaId))
    }
    
    console.log('서버로 전송할 데이터:', serverData);
    
    // 서버에 데이터 전송
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serverData)
    });
    
    if (!response.ok) {
      throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('서버 응답:', data);
    
    // 응답 유효성 검사
    if (!data.success) {
      throw new Error('서버에서 시간표 생성에 실패했습니다.');
    }
    
    // 응답 데이터와 함께 결과 페이지로 이동
    navigate('/result', { 
      state: { 
        ...formData,
        serverResponse: data
      } 
    });
  } catch (error) {
    console.error('서버 요청 오류:', error);
    alert(`시간표 생성 중 오류가 발생했습니다: ${error.message}`);
  } finally {
    // 로딩 상태 종료
    setIsLoading(false);
  }
}

  const openModal = () => {
    setIsModalOpen(true)
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
    setSelectedDeptTemp(deptValue)
    
    setTimeout(() => {
      handleButtonSelect('department', deptValue)
      closeModal()
    }, 150)
  }

  // 교양 영역 처리 함수
  const handleGeneralAreaToggle = (areaId) => {
    setFormData(prevState => {
      const maxAreas = getMaxSelectableAreas(prevState.generalCredits)
      const isSelected = prevState.generalAreas.includes(areaId)

      // 원격 강의 희망은 다른 영역과 독립적으로 선택 가능
      if (areaId === 'remote') {
        return {
          ...prevState,
          generalAreas: isSelected 
            ? prevState.generalAreas.filter(id => id !== 'remote')
            : [...prevState.generalAreas.filter(id => id !== 'remote'), 'remote']
        }
      }

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
  const creditOptions = [0, 3, 6, 9, 12, 15, 18]

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
            <div className="grid grid-cols-3 gap-3">
              {[2, 3, 4].map((year) => (
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
              className="department-select-button"
            >
              <span>{getCurrentDepartmentLabel()}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* 전공학점 버튼 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              전공학점 (선택: {formData.majorCredits}학점)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              교양학점 (선택: {formData.generalCredits}학점)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 mb-4">
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
            
            {/* 교양 영역 선택은 교양학점이 0이 아닐 때만 표시 */}
            {formData.generalCredits !== '0' && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  교양 영역 선택
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {generalAreas.map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      className={`general-area-button ${
                        isGeneralAreaSelected(area.id)
                          ? 'general-area-button-selected'
                          : 'general-area-button-unselected'
                      }`}
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
              </>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '시간표 추천'}
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
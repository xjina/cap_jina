import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './TimetableResult.css'

// API URL 설정
const API_URL = 'http://15.164.214.242:5000/api/timetable'

// 더미 시간표 데이터
const dummySchedule = [
  // 전공 과목
  {
    id: 1,
    name: '운영체제',
    professor: '김교수',
    type: 'major',
    day: '월',
    startPeriod: 1, // 9:00
    endPeriod: 2,   // 11:00
    location: '공학관 204',
    credits: 3,
    color: '#4F46E5'
  },
  {
    id: 2,
    name: '데이터베이스',
    professor: '이교수',
    type: 'major',
    day: '화',
    startPeriod: 3,
    endPeriod: 4,
    location: '공학관 305',
    credits: 3,
    color: '#7C3AED'
  },
  {
    id: 3,
    name: '컴퓨터네트워크',
    professor: '박교수',
    type: 'major',
    day: '수',
    startPeriod: 1,
    endPeriod: 2,
    location: '공학관 401',
    credits: 3,
    color: '#EC4899'
  },
  {
    id: 4,
    name: '알고리즘',
    professor: '최교수',
    type: 'major',
    day: '목',
    startPeriod: 5,
    endPeriod: 6,
    location: '공학관 202',
    credits: 3,
    color: '#8B5CF6'
  },
  {
    id: 5,
    name: '소프트웨어공학',
    professor: '정교수',
    type: 'major',
    day: '금',
    startPeriod: 3,
    endPeriod: 4,
    location: '공학관 306',
    credits: 3,
    color: '#06B6D4'
  },
  {
    id: 6,
    name: '인공지능',
    professor: '한교수',
    type: 'major',
    day: '월',
    startPeriod: 7,
    endPeriod: 8,
    location: '공학관 505',
    credits: 3,
    color: '#2563EB'
  },
  // 교양 과목
  {
    id: 7,
    name: '글로벌리더십',
    professor: '송교수',
    type: 'general',
    area: 'global', // 영역 추가
    day: '화',
    startPeriod: 1,
    endPeriod: 2,
    location: '교양관 102',
    credits: 3,
    color: '#DC2626'
  },
  {
    id: 8,
    name: '현대미술의이해',
    professor: '임교수',
    type: 'general',
    area: 'literature', // 영역 추가
    day: '수',
    startPeriod: 5,
    endPeriod: 6,
    location: '교양관 205',
    credits: 3,
    color: '#EA580C'
  },
  {
    id: 9,
    name: '철학의이해',
    professor: '윤교수',
    type: 'general',
    area: 'philosophy', // 영역 추가
    day: '목',
    startPeriod: 1,
    endPeriod: 2,
    location: '교양관 304',
    credits: 3,
    color: '#65A30D'
  },
  {
    id: 10,
    name: '과학기술과사회',
    professor: '강교수',
    type: 'general',
    area: 'science', // 영역 추가
    day: '금',
    startPeriod: 1,
    endPeriod: 2,
    location: '교양관 401',
    credits: 3,
    color: '#0891B2'
  },
  {
    id: 11,
    name: '창업과비즈니스',
    professor: '조교수',
    type: 'general',
    area: 'career', // 영역 추가
    day: '화',
    startPeriod: 7,
    endPeriod: 8,
    location: '교양관 503',
    credits: 3,
    color: '#7C2D12'
  },
  {
    id: 12,
    name: '세계문화의이해',
    professor: '김교수',
    type: 'general',
    area: 'society', // 영역 추가
    day: '목',
    startPeriod: 7,
    endPeriod: 8,
    location: '교양관 105',
    credits: 3,
    color: '#9333EA'
  }
]

// 동일 과목 다른 교수 더미 데이터
const dummyAlternatives = {
  '운영체제': [
    {
      id: 101,
      name: '운영체제',
      professor: '박교수',
      type: 'major',
      day: '화',
      startPeriod: 1,
      endPeriod: 2,
      location: '공학관 304',
      credits: 3,
      color: '#4F46E5'
    },
    {
      id: 102,
      name: '운영체제',
      professor: '이교수',
      type: 'major',
      day: '수',
      startPeriod: 7,
      endPeriod: 8,
      location: '공학관 404',
      credits: 3,
      color: '#4F46E5'
    }
  ],
  '데이터베이스': [
    {
      id: 201,
      name: '데이터베이스',
      professor: '홍교수',
      type: 'major',
      day: '목',
      startPeriod: 1,
      endPeriod: 2,
      location: '공학관 205',
      credits: 3,
      color: '#7C3AED'
    },
    {
      id: 202,
      name: '데이터베이스',
      professor: '최교수',
      type: 'major',
      day: '금',
      startPeriod: 5,
      endPeriod: 6,
      location: '공학관 306',
      credits: 3,
      color: '#7C3AED'
    }
  ],
  '컴퓨터네트워크': [
    {
      id: 301,
      name: '컴퓨터네트워크',
      professor: '정교수',
      type: 'major',
      day: '월',
      startPeriod: 5,
      endPeriod: 6,
      location: '공학관 301',
      credits: 3,
      color: '#EC4899'
    }
  ]
}

// 원격 강의 더미 데이터
const dummyRemoteClasses = [
  {
    id: 101,
    name: '인공지능과 윤리',
    professor: '박교수',
    type: 'major',
    credits: 3,
    color: '#EF4444',
    deadline: '금요일 23:59'
  },
  {
    id: 102,
    name: '디지털 미디어의 이해',
    professor: '이교수',
    type: 'general',
    area: 'digital',
    credits: 2,
    color: '#F59E0B',
    deadline: '일요일 23:59'
  },
  {
    id: 103,
    name: '창업과 혁신',
    professor: '최교수',
    type: 'general',
    area: 'career',
    credits: 2,
    color: '#10B981',
    deadline: '화요일 23:59'
  }
]

// 원격 강의 대체 데이터
const dummyRemoteAlternatives = {
  '인공지능과 윤리': [
    {
      id: 401,
      name: '인공지능과 윤리',
      professor: '김교수',
      type: 'major',
      credits: 3,
      color: '#EF4444',
      deadline: '일요일 23:59'
    },
    {
      id: 402,
      name: '인공지능과 윤리',
      professor: '최교수',
      type: 'major',
      credits: 3,
      color: '#EF4444',
      deadline: '토요일 23:59'
    }
  ],
  '디지털 미디어의 이해': [
    {
      id: 501,
      name: '디지털 미디어의 이해',
      professor: '윤교수',
      type: 'general',
      area: 'digital',
      credits: 2,
      color: '#F59E0B',
      deadline: '월요일 23:59'
    }
  ]
}

const TimetableResult = () => {
  const location = useLocation()
  const formData = location.state || {}
  const serverResponse = formData.serverResponse || null
  const days = ['월', '화', '수', '목', '금']
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [selectedClass, setSelectedClass] = useState(null)
  const [alternatives, setAlternatives] = useState([])
  const [showModal, setShowModal] = useState(false)
  
  // 서버 응답 데이터 또는 더미 데이터를 사용하여 초기화
  const [schedule, setSchedule] = useState([])
  const [remoteClasses, setRemoteClasses] = useState([])
  const [isRemoteSelected, setIsRemoteSelected] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // 교양 영역 이름 가져오기
  const getAreaName = (areaId) => {
    const areaMap = {
      'literature': '문학과예술',
      'society': '사회와문화',
      'global': '글로벌리더십',
      'science': '과학과기술',
      'career': '진로탐색/자기개발/창업',
      'philosophy': '철학과역사',
      'remote': '원격 강의 희망'
    }
    return areaMap[areaId] || areaId
  }
  
  // 학과명 가져오기
  const getCurrentDepartmentLabel = () => {
    return formData.departmentLabel || '학과 정보 없음'
  }
  
  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // 초기 데이터 로드
  useEffect(() => {
    // 서버 응답이 있으면 서버 데이터를 사용하고, 없으면 더미 데이터 사용
    if (serverResponse) {
      console.log('서버에서 받은 시간표 데이터:', serverResponse)
      
      try {
        // 서버에서 받은 시간표 데이터 설정
        if (serverResponse.schedule) {
          console.log('서버 시간표 데이터 확인:', serverResponse.schedule)
          setSchedule(serverResponse.schedule)
        } else {
          console.warn('서버 응답에 시간표 데이터가 없어 더미 데이터를 사용합니다.')
          setSchedule(getFilteredSchedule())
        }
        
        // 서버에서 받은 원격 강의 데이터 설정
        if (serverResponse.remoteClasses) {
          console.log('서버 원격 강의 데이터 확인:', serverResponse.remoteClasses)
          setRemoteClasses(serverResponse.remoteClasses)
        } else {
          console.warn('서버 응답에 원격 강의 데이터가 없어 더미 데이터를 사용합니다.')
          setRemoteClasses(getFilteredRemoteClasses())
        }
      } catch (error) {
        console.error('서버 응답 처리 중 오류 발생:', error)
        alert('서버 응답 처리 중 오류가 발생했습니다. 더미 데이터를 사용합니다.')
        setSchedule(getFilteredSchedule())
        setRemoteClasses(getFilteredRemoteClasses())
      }
    } else {
      console.log('서버 응답이 없어 더미 데이터를 사용합니다.')
      setSchedule(getFilteredSchedule())
      setRemoteClasses(getFilteredRemoteClasses())
    }
  }, [serverResponse])
  
  // 강의 선택 처리
  const handleClassClick = (cls) => {
    setSelectedClass(cls)
    setIsRemoteSelected(false)
    
    // 서버 응답에 대체 강의 정보가 있으면 사용
    if (serverResponse && serverResponse.alternatives && serverResponse.alternatives[cls.name]) {
      setAlternatives(serverResponse.alternatives[cls.name])
      setShowModal(true)
      setTimeout(() => {
        setIsAnimating(true)
      }, 10)
    } 
    // 서버 응답이 없거나 대체 강의 정보가 없으면 더미 데이터 사용
    else if (dummyAlternatives[cls.name]) {
      setAlternatives(dummyAlternatives[cls.name])
      setShowModal(true)
      setTimeout(() => {
        setIsAnimating(true)
      }, 10)
    } else {
      alert('이 과목에 대한 다른 교수의 강의가 없습니다.')
    }
  }

  // 원격 강의 선택 처리
  const handleRemoteClassClick = (cls) => {
    setSelectedClass(cls)
    setIsRemoteSelected(true)
    
    // 서버 응답에 대체 원격 강의 정보가 있으면 사용
    if (serverResponse && serverResponse.remoteAlternatives && serverResponse.remoteAlternatives[cls.name]) {
      setAlternatives(serverResponse.remoteAlternatives[cls.name])
      setShowModal(true)
      setTimeout(() => {
        setIsAnimating(true)
      }, 10)
    } 
    // 서버 응답이 없거나 대체 원격 강의 정보가 없으면 더미 데이터 사용
    else if (dummyRemoteAlternatives[cls.name]) {
      setAlternatives(dummyRemoteAlternatives[cls.name])
      setShowModal(true)
      setTimeout(() => {
        setIsAnimating(true)
      }, 10)
    } else {
      alert('이 과목에 대한 다른 교수의 강의가 없습니다.')
    }
  }
  
  // 시간표 재생성 함수 (서버 API 연동)
  const regenerateTimetable = async () => {
    // 로딩 상태 시작
    setIsLoading(true)
    setSchedule([])
    setRemoteClasses([])
    
    try {
      // 서버로 동일한 조건으로 재요청
      const serverData = {
        department: getCurrentDepartmentLabel(),
        grade: parseInt(formData.year),
        semester: parseInt(formData.semester),
        majorCredits: parseInt(formData.majorCredits),
        liberalCredits: parseInt(formData.generalCredits),
        liberalAreas: formData.generalAreas.map(areaId => getAreaName(areaId))
      }
      
      console.log('재생성 요청 데이터:', serverData)
      
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
      console.log('재생성 응답 데이터:', data);
      
      // 응답 데이터로 시간표 업데이트
      if (data.schedule) {
        setSchedule(data.schedule)
      } else {
        console.warn('재생성 응답에 시간표 데이터가 없어 더미 데이터를 사용합니다.')
        setSchedule(getFilteredSchedule())
      }
      
      if (data.remoteClasses) {
        setRemoteClasses(data.remoteClasses)
      } else {
        console.warn('재생성 응답에 원격 강의 데이터가 없어 더미 데이터를 사용합니다.')
        setRemoteClasses(getFilteredRemoteClasses())
      }
      
    } catch (error) {
      console.error('시간표 재생성 오류:', error)
      alert(`시간표 재생성 중 오류가 발생했습니다: ${error.message}`)
      
      // 오류 발생 시 더미 데이터 사용
      setSchedule(getFilteredSchedule())
      setRemoteClasses(getFilteredRemoteClasses())
    } finally {
      // 로딩 상태 종료
      setIsLoading(false)
    }
  }

  // 시간대 설정
  const timeSlots = [
    { period: 1, time: '9' },
    { period: 2, time: '10' },
    { period: 3, time: '11' },
    { period: 4, time: '12' },
    { period: 5, time: '1' },
    { period: 6, time: '2' },
    { period: 7, time: '3' },
    { period: 8, time: '4' },
    { period: 9, time: '5' },
    { period: 10, time: '6' }
  ]

  // 전공, 교양 학점에 맞게 시간표 필터링
  const getFilteredSchedule = () => {
    let majorCount = 0
    let generalCount = 0
    const majorLimit = parseInt(formData.majorCredits) / 3
    const generalLimit = parseInt(formData.generalCredits) / 3

    return dummySchedule.filter(course => {
      if (course.type === 'major' && majorCount < majorLimit) {
        majorCount++
        return true
      }
      if (course.type === 'general' && generalCount < generalLimit) {
        // 교양 영역이 선택되어 있고, 해당 영역의 과목인 경우만 포함
        if (formData.generalAreas && formData.generalAreas.includes(course.area)) {
          generalCount++
          return true
        }
      }
      return false
    })
  }

  // 원격 강의 필터링
  const getFilteredRemoteClasses = () => {
    let majorCount = 0
    let generalCount = 0
    const majorLimit = parseInt(formData.majorCredits) / 3
    const generalLimit = parseInt(formData.generalCredits) / 3

    // 원격 강의 희망 여부 확인
    const wantsRemote = formData.generalAreas.includes('remote')

    return dummyRemoteClasses.filter(course => {
      if (course.type === 'major' && majorCount < majorLimit) {
        majorCount++
        return true
      }
      if (course.type === 'general' && generalCount < generalLimit) {
        // 교양 영역이 선택되어 있고, 해당 영역의 과목인 경우만 포함
        if (formData.generalAreas && formData.generalAreas.includes(course.area)) {
          // 원격 강의 희망이 선택된 경우에만 원격 강의를 포함
          if (wantsRemote) {
            generalCount++
            return true
          }
        }
      }
      return false
    })
  }

  const filteredRemoteClasses = getFilteredRemoteClasses()

  // 모달 닫기
  const closeModal = () => {
    setIsAnimating(false)
    // 애니메이션이 완전히 끝난 후 모달을 닫기
    setTimeout(() => {
      setShowModal(false)
      setSelectedClass(null)
      setAlternatives([])
      setIsRemoteSelected(false)
    }, 300)
  }

  // 다른 교수 강의로 교체
  const replaceClass = (newClass) => {
    if (isRemoteSelected) {
      // 원격 강의 교체
      const updatedRemoteClasses = remoteClasses.filter(cls => cls.id !== selectedClass.id)
      updatedRemoteClasses.push(newClass)
      setRemoteClasses(updatedRemoteClasses)
    } else {
      // 일반 강의 교체
      const updatedSchedule = schedule.filter(cls => cls.id !== selectedClass.id)
      updatedSchedule.push(newClass)
      setSchedule(updatedSchedule)
    }
    
    // 모달 닫기
    closeModal()
  }

  // 특정 교시에 해당하는 수업 찾기
  const findClass = (day, period) => {
    return schedule.find(
      cls => 
        cls.day === day && 
        period >= cls.startPeriod && 
        period <= cls.endPeriod
    )
  }

  // 수업 셀 렌더링
  const renderClassCell = (cls, isStart) => {
    if (!cls) return null
    
    if (isStart) {
      const rowSpan = cls.endPeriod - cls.startPeriod + 1
      // 고정 픽셀 높이 계산
      const heightPx = isMobile ? 35 * rowSpan : 50 * rowSpan
      
      return (
        <div 
          className="class-content"
          style={{ 
            backgroundColor: `${cls.color}15`,
            borderLeft: `4px solid ${cls.color}`,
            height: `${heightPx}px`,
            cursor: 'pointer'
          }}
          onClick={() => handleClassClick(cls)}
        >
          <div className="class-name">{cls.name}</div>
          {/* 모바일에서는 정보를 줄여서 표시 */}
          {!isMobile && (
            <>
              <div className="class-professor">{cls.professor}</div>
              <div className="class-location">{cls.location}</div>
            </>
          )}
          {isMobile && rowSpan > 1 && (
            <div className="class-professor">{cls.professor}</div>
          )}
        </div>
      )
    }
    return null
  }

  // 특정 교시에 해당하는 다른 수업이 있는지 확인
  const shouldRenderEmpty = (day, period) => {
    const cls = findClass(day, period)
    if (!cls) return true
    return cls.startPeriod === period
  }

  // 원격 강의 바 렌더링
  const renderRemoteClasses = () => {
    if (remoteClasses.length === 0) {
      if (formData.generalAreas.includes('remote')) {
        return (
          <div className="remote-classes-container">
            <h2 className="remote-classes-title">원격 강의</h2>
            <div className="no-remote-classes">
              선택한 교양 영역에 해당하는 원격 강의가 없습니다.
            </div>
          </div>
        )
      }
      return null
    }
    
    return (
      <div className="remote-classes-container">
        <h2 className="remote-classes-title">원격 강의</h2>
        <div className="remote-classes-list">
          {remoteClasses.map(course => (
            <div 
              key={course.id} 
              className="remote-class-item"
              style={{ 
                backgroundColor: `${course.color}15`,
                borderLeft: `4px solid ${course.color}`,
                cursor: 'pointer'
              }}
              onClick={() => handleRemoteClassClick(course)}
            >
              <div className="remote-class-name">{course.name}</div>
              <div className="remote-class-professor">{course.professor}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 대체 강의 모달 렌더링
  const renderAlternativesModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="timetable-modal-overlay" onClick={closeModal}>
        <div 
          className={`timetable-modal-content ${isAnimating ? 'slide-up' : ''}`} 
          onClick={e => e.stopPropagation()}
        >
          <div className="timetable-modal-header">
            <h3>대체 가능한 강의</h3>
            <button className="timetable-modal-close" onClick={closeModal}>×</button>
          </div>
          <div className="timetable-modal-body">
            <div className="selected-class">
              <p><strong>현재 선택된 강의:</strong></p>
              <div 
                className="alternative-item selected"
                style={{ 
                  backgroundColor: `${selectedClass.color}15`,
                  borderLeft: `4px solid ${selectedClass.color}`
                }}
              >
                <div className="alternative-name">{selectedClass.name}</div>
                <div className="alternative-details">
                  <div><strong>교수:</strong> {selectedClass.professor}</div>
                  {!isRemoteSelected ? (
                    <>
                      <div><strong>시간:</strong> {selectedClass.day}요일 {timeSlots[selectedClass.startPeriod-1].time}-{timeSlots[selectedClass.endPeriod-1].time}</div>
                      <div><strong>위치:</strong> {selectedClass.location}</div>
                    </>
                  ) : (
                    <div><strong>마감일:</strong> {selectedClass.deadline}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="alternatives-list">
              <p><strong>대체 가능한 강의:</strong></p>
              {alternatives.map(alt => (
                <div 
                  key={alt.id}
                  className="alternative-item"
                  style={{ 
                    backgroundColor: `${alt.color}15`,
                    borderLeft: `4px solid ${alt.color}`
                  }}
                  onClick={() => replaceClass(alt)}
                >
                  <div className="alternative-name">{alt.name}</div>
                  <div className="alternative-details">
                    <div><strong>교수:</strong> {alt.professor}</div>
                    {!isRemoteSelected ? (
                      <>
                        <div><strong>시간:</strong> {alt.day}요일 {timeSlots[alt.startPeriod-1].time}-{timeSlots[alt.endPeriod-1].time}</div>
                        <div><strong>위치:</strong> {alt.location}</div>
                      </>
                    ) : (
                      <div><strong>마감일:</strong> {alt.deadline}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="error-message">
        <h1>잘못된 접근입니다</h1>
        <p>시간표 생성 페이지에서 정상적으로 접근해주세요.</p>
      </div>
    )
  }

  return (
    <main className="timetable-result-main">
      <div className="result-container">
        {/* 타이틀 및 선택 정보 표시 */}
        <div className="result-header">
          <h1 className="result-title">시간표 추천 결과</h1>
          <div className="selected-options">
            <p>
              <strong>{formData.year}학년 {formData.semester}학기</strong> | 
              <strong> {getCurrentDepartmentLabel()}</strong> | 
              전공 <strong>{formData.majorCredits}학점</strong> | 
              교양 <strong>{formData.generalCredits}학점</strong>
            </p>
            <p className="selected-areas">
              {formData.generalAreas && formData.generalAreas.length > 0 
                ? `선택 영역: ${formData.generalAreas
                    .filter(area => area !== 'remote')
                    .map(area => getAreaName(area))
                    .join(', ')}`
                : '선택된 교양 영역 없음'
              }
              {formData.generalAreas && formData.generalAreas.includes('remote') && 
                ' (원격 강의 희망)'}
            </p>
            {serverResponse ? (
              <p className="server-response-info">
                서버에서 생성된 시간표입니다.
              </p>
            ) : (
              <p className="dummy-data-info">
                테스트용 더미 데이터로 생성된 시간표입니다.
              </p>
            )}
          </div>
        </div>
        
        <div className="timetable-container">
          <table className="timetable">
            <thead>
              <tr>
                <th className="time-header"></th>
                {days.map(day => (
                  <th key={day} className="day-header">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(({ period, time }) => (
                <tr key={period}>
                  <td className="period-cell">{time}</td>
                  {days.map(day => {
                    const cls = findClass(day, period)
                    const isStart = cls?.startPeriod === period
                    
                    // 이전 교시에서 시작한 수업이 여기까지 이어지는 경우 렌더링하지 않음
                    if (!shouldRenderEmpty(day, period) && !isStart) {
                      return <td key={`${day}-${period}`} className="class-cell occupied"></td>
                    }
                    
                    return (
                      <td 
                        key={`${day}-${period}`} 
                        className={`class-cell ${cls ? 'has-class' : ''}`}
                        style={{
                          padding: cls ? '0' : undefined
                        }}
                      >
                        {renderClassCell(cls, isStart)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {renderRemoteClasses()}
        
        <div className="regenerate-button-container">
          <button 
            className="regenerate-button"
            onClick={regenerateTimetable}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '동일 조건으로 시간표 재생성'}
          </button>
        </div>
        
        {renderAlternativesModal()}
      </div>
    </main>
  )
}

export default TimetableResult
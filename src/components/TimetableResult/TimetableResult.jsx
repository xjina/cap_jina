import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import './TimetableResult.css'

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

const TimetableResult = () => {
  const location = useLocation()
  const formData = location.state
  const days = ['월', '화', '수', '목', '금']
  const tableRef = useRef(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
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

    console.log('Selected general areas:', formData.generalAreas) // 디버깅용

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

    return dummyRemoteClasses.filter(course => {
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

  const filteredSchedule = getFilteredSchedule()
  const filteredRemoteClasses = getFilteredRemoteClasses()

  // 특정 교시에 해당하는 수업 찾기
  const findClass = (day, period) => {
    return filteredSchedule.find(
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
            height: `${heightPx}px`
          }}
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
    if (filteredRemoteClasses.length === 0) return null
    
    return (
      <div className="remote-classes-container">
        <h2 className="remote-classes-title">원격 강의</h2>
        <div className="remote-classes-list">
          {filteredRemoteClasses.map(course => (
            <div 
              key={course.id} 
              className="remote-class-item"
              style={{ 
                backgroundColor: `${course.color}15`,
                borderLeft: `4px solid ${course.color}`
              }}
            >
              <div className="remote-class-name">{course.name}</div>
              <div className="remote-class-professor">{course.professor}</div>
            </div>
          ))}
        </div>
      </div>
    )
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
      <div className="timetable-result-header">
        <h1 className="timetable-result-title">생성된 시간표</h1>
        <div className="timetable-info">
          <p>{formData.year}학년 {formData.semester}학기</p>
          <p>{formData.departmentLabel}</p>
          <p>전공 {formData.majorCredits}학점</p>
          <p>교양 {formData.generalCredits}학점</p>
        </div>
      </div>

      <div className="timetable-container">
        <table className="timetable" ref={tableRef}>
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
    </main>
  )
}

export default TimetableResult
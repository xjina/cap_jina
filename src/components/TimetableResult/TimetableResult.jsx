import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './TimetableResult.css'

// API URL 설정
const API_URL = 'https://kmutime.duckdns.org/api/timetable'

// 색상 배열을 전역으로 정의
const COLORS = [
  '#4C51BF', '#38B2AC', '#ED8936', '#48BB78', 
  '#9F7AEA', '#F56565', '#667EEA', '#D69E2E'
]

// 시간을 교시로 변환하는 함수
const convertTimeToPeroid = (timeString) => {
  // 원격 강의나 특수 시간 처리
  if (timeString === "00:00" || !timeString) {
    return 1; // 원격 강의는 교시가 의미 없음
  }
  
  const time = timeString.split(':').map(Number);
  let hour = time[0];
  const minute = time[1];
  
  // 오후 시간 처리 (1~8시는 오후로 간주)
  if (hour >= 1 && hour <= 8) {
    hour += 12;
  }
  
  // 9시 기준으로 교시 계산 (9:00 = 1교시 시작)
  if (hour < 9) return 1;
  
  // 시간을 분으로 변환 후 계산
  const totalMinutes = hour * 60 + minute;
  const startMinutes = 9 * 60; // 9:00 AM
  
  // 75분(1시간 15분) 단위로 교시 계산
  const period = Math.floor((totalMinutes - startMinutes) / 75) + 1;
  
  // 교시 범위 제한 (1-10교시)
  return Math.max(1, Math.min(10, period));
}

// 서버 응답 데이터를 앱 형식으로 변환하는 함수
const transformServerData = (serverResponse) => {
  if (!serverResponse || !serverResponse.data) {
    console.warn('서버 응답에 데이터가 없습니다');
    return { schedule: [], remoteClasses: [] };
  }
  
  const { offline, online } = serverResponse.data;
  const schedule = [];
  const remoteClasses = [];
  
  // 강의 데이터 변환 공통 함수
  const transformCourse = (course, type, isRemote = false) => {
    if (isRemote) {
      return {
        id: `remote-${type}-${course.code}`,
        name: course.name,
        professor: course.professor,
        type: type,
        area: course.area,
        credits: course.credit,
        note: course.note || "",
        color: COLORS[remoteClasses.length % COLORS.length]
      };
    } else {
      return course.time_json.map(timeSlot => ({
        id: `${type}-${course.code}-${timeSlot.day}`,
        name: course.name,
        professor: course.professor,
        type: type,
        area: course.area,
        day: timeSlot.day,
        startPeriod: convertTimeToPeroid(timeSlot.start),
        endPeriod: convertTimeToPeroid(timeSlot.end),
        location: timeSlot.room,
        credits: course.credit,
        color: COLORS[schedule.length % COLORS.length]
      }));
    }
  };

  // 원격 강의 판별 함수
  const isRemoteCourse = (course) => {
    return course.time_json && 
           course.time_json.length > 0 && 
           (course.time_json[0].day === "원격" || 
            course.time_json[0].day.trim().toLowerCase() === "원격" ||
            course.time_json[0].day.includes("원격"));
  };

  // 오프라인 전공 강의 변환
  if (offline?.major) {
    offline.major.forEach(course => {
      schedule.push(...transformCourse(course, 'major'));
    });
  }

  // 오프라인 교양 강의 변환
  if (offline?.liberal) {
    offline.liberal.forEach(course => {
      schedule.push(...transformCourse(course, 'general'));
    });
  }

  // 온라인 전공 강의 변환
  if (online?.major) {
    online.major.forEach(course => {
      if (isRemoteCourse(course)) {
        remoteClasses.push(transformCourse(course, 'major', true));
      }
    });
  }

  // 온라인 교양 강의 변환
  if (online?.liberal) {
    online.liberal.forEach(course => {
      if (isRemoteCourse(course)) {
        remoteClasses.push(transformCourse(course, 'general', true));
      }
    });
  }

  return { schedule, remoteClasses };
};

const TimetableResult = () => {
  const location = useLocation()
  const formData = location.state || {}
  console.log('TimetableResult 컴포넌트 마운트 - formData:', formData);
  const serverResponse = formData.serverResponse || null
  const days = ['월', '화', '수', '목', '금']
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [selectedClass, setSelectedClass] = useState(null)
  const [alternatives, setAlternatives] = useState([])
  const [showModal, setShowModal] = useState(false)
  
  // 서버 응답 데이터를 사용하여 초기화
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
      'career': '진로탐색/자기계발/창업',
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
    const loadData = () => {
      if (!serverResponse) {
        console.log('서버 응답이 없습니다.');
        setSchedule([]);
        setRemoteClasses([]);
        return;
      }

      try {
        const transformedData = transformServerData(serverResponse);
        
        setSchedule(transformedData.schedule || []);
        setRemoteClasses(transformedData.remoteClasses || []);
      } catch (error) {
        console.error('서버 응답 처리 중 오류 발생:', error);
        alert('서버 응답 처리 중 오류가 발생했습니다.');
        setSchedule([]);
        setRemoteClasses([]);
      }
    };

    loadData();
  }, [serverResponse]);
  
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
    } else {
      alert('이 과목에 대한 다른 교수의 강의가 없습니다.')
    }
  }
  
  // 시간표 재생성 함수 (서버 API 연동)
  const regenerateTimetable = async () => {
    // 로딩 상태 시작
    setIsLoading(true);
    setSchedule([]);
    setRemoteClasses([]);
    
    try {
      // 교양 영역이 배열인지 확인
      if (!Array.isArray(formData.generalAreas)) {
        console.error('교양 영역이 배열이 아닙니다:', formData.generalAreas);
        throw new Error('교양 영역 데이터가 올바르지 않습니다.');
      }

      // 서버로 동일한 조건으로 재요청
      const serverData = {
        department: getCurrentDepartmentLabel(),
        grade: parseInt(formData.year),
        semester: parseInt(formData.semester),
        majorCredits: parseInt(formData.majorCredits),
        liberalCredits: parseInt(formData.generalCredits),
        liberalAreas: formData.generalAreas.map(areaId => getAreaName(areaId))
      };
      
      console.log('재생성 요청 데이터:', serverData);
      console.log('원본 교양 영역:', formData.generalAreas);
      console.log('변환된 교양 영역:', serverData.liberalAreas);
      
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
      
      // 서버 응답 데이터를 앱 형식으로 변환
      const transformedData = transformServerData(data);
      
      if (transformedData.schedule && transformedData.schedule.length > 0) {
        setSchedule(transformedData.schedule);
      } else {
        console.warn('변환된 시간표가 없습니다.');
        setSchedule([]);
      }
      
      if (transformedData.remoteClasses && transformedData.remoteClasses.length > 0) {
        setRemoteClasses(transformedData.remoteClasses);
      } else {
        console.warn('변환된 원격 강의가 없습니다.');
        setRemoteClasses([]);
      }
      
    } catch (error) {
      console.error('시간표 재생성 오류:', error);
      alert(`시간표 재생성 중 오류가 발생했습니다: ${error.message}`);
      setSchedule([]);
      setRemoteClasses([]);
    } finally {
      // 로딩 상태 종료
      setIsLoading(false);
    }
  };

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
    if (!remoteClasses?.length) {
      if (formData.generalAreas?.includes('remote')) {
        return (
          <div className="remote-classes-container">
            <h2 className="remote-classes-title">원격 강의</h2>
            <div className="no-remote-classes">
              선택한 교양 영역에 해당하는 원격 강의가 없습니다.
            </div>
          </div>
        );
      }
      return null;
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
              {course.area && <div className="remote-class-area">{course.area}</div>}
              {course.note && <div className="remote-class-note">{course.note}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

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
                    <>
                      {selectedClass.area && <div><strong>영역:</strong> {selectedClass.area}</div>}
                      {selectedClass.note && <div><strong>비고:</strong> {selectedClass.note}</div>}
                    </>
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
                      <>
                        {alt.area && <div><strong>영역:</strong> {alt.area}</div>}
                        {alt.note && <div><strong>비고:</strong> {alt.note}</div>}
                      </>
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
                서버 응답이 없습니다.
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
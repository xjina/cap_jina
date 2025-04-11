import React, { useState, useEffect } from 'react';
import './DepartmentModal.css';

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
];

const DepartmentModal = ({ 
  isOpen, 
  onClose, 
  onSelectDepartment,
  currentDepartment
}) => {
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
      setSelectedCollege(null)
    }, 300)
  }

  useEffect(() => {
    if (isOpen) {
      setSelectedCollege(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college);
  };

  const handleDepartmentSelect = (dept) => {
    setTimeout(() => {
      onSelectDepartment(dept.value, dept.label);
      handleClose();
    }, 150);
  };

  const handleBack = () => {
    setSelectedCollege(null);
  };

  return (
    <>
      <div 
        className={`dept-modal-overlay ${isClosing ? 'closing' : ''}`}
        onClick={handleClose}
      />
      
      <div className={`dept-modal-content ${isClosing ? 'closing' : ''}`}>
        <div className="dept-modal-header">
          <h3 className="dept-modal-title">
            {selectedCollege ? '학과 선택' : '단과대학 선택'}
          </h3>
          <button 
            onClick={handleClose}
            className="dept-modal-close"
            aria-label="닫기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="dept-modal-body">
          {!selectedCollege ? (
            <div className="college-list">
              {collegesAndDepartments.map((college) => (
                <button
                  key={college.id}
                  className="college-item"
                  onClick={() => handleCollegeSelect(college)}
                >
                  <span>{college.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            <div className="department-list">
              {selectedCollege.departments.map((dept) => (
                <button
                  key={dept.value}
                  className={`department-item ${currentDepartment === dept.value ? 'selected' : ''}`}
                  onClick={() => handleDepartmentSelect(dept)}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedCollege && (
          <div className="modal-footer">
            <button
              className="back-button"
              onClick={handleBack}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              단과대학 선택으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DepartmentModal;
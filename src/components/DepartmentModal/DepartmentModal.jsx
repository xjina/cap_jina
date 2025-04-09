import React, { useState } from 'react';
import './DepartmentModal.css';

const DepartmentModal = ({ 
  isOpen, 
  isClosing, 
  onClose, 
  collegesAndDepartments,
  onSelectDepartment
}) => {
  const [selectedCollege, setSelectedCollege] = useState(null);
  
  if (!isOpen) return null;

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college);
  };

  const handleDepartmentSelect = (deptValue) => {
    onSelectDepartment(deptValue);
  };

  const handleBack = () => {
    setSelectedCollege(null);
  };

  return (
    <>
      <div 
        className={`dept-modal-overlay ${isClosing ? 'closing' : ''}`}
        onClick={onClose}
      />
      
      <div className={`dept-modal-content ${isClosing ? 'closing' : ''}`}>
        <div className="modal-header">
          <h3 className="modal-title">
            {selectedCollege ? '학과 선택' : '단과대학 선택'}
          </h3>
          <button 
            onClick={onClose}
            className="modal-close-button"
            aria-label="닫기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          {!selectedCollege ? (
            <div className="college-list">
              {collegesAndDepartments.map((college) => (
                <button
                  key={college.id}
                  type="button"
                  className="college-button"
                  onClick={() => handleCollegeSelect(college)}
                >
                  <span>{college.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
                  type="button"
                  className="department-button"
                  onClick={() => handleDepartmentSelect(dept.value)}
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
              type="button"
              className="back-button"
              onClick={handleBack}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
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
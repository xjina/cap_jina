//Step1 - 학년 및 학기 선택 단계
import "./Step1.css";

const Step1YearSemester = ({ formData, updateFormData, goToNextStep }) => {
  const getButtonClass = (currentValue, buttonValue) => {
    return currentValue === buttonValue ? "button-active" : "button-inactive";
  };

  const handleButtonSelect = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Step 1: 학년 및 학기 선택</h2>

      {/* 학년 버튼 */}
      <div className="step-section">
        <label className="step-label">학년</label>
        <div className="year-buttons">
          {[2, 3, 4].map((year) => (
            <button
              key={`year-${year}`}
              type="button"
              className={getButtonClass(formData.year, String(year))}
              onClick={() => handleButtonSelect("year", String(year))}
            >
              {year}학년
            </button>
          ))}
        </div>
      </div>

      {/* 학기 버튼 */}
      <div className="step-section">
        <label className="step-label">학기</label>
        <div className="semester-buttons">
          {[1, 2].map((semester) => (
            <button
              key={`semester-${semester}`}
              type="button"
              className={getButtonClass(formData.semester, String(semester))}
              onClick={() => handleButtonSelect("semester", String(semester))}
            >
              {semester}학기
            </button>
          ))}
        </div>
      </div>

      {/* 다음 단계 버튼 */}
      <div className="step-footer">
        <button type="button" onClick={goToNextStep} className="next-button">
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default Step1YearSemester;

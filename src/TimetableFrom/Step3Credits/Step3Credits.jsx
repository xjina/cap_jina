// Step3 - 학점 선택 단계
import "./Step3.css";

const Step3Credits = ({
  formData,
  updateFormData,
  goToNextStep,
  goToPrevStep,
}) => {
  // 버튼 스타일 클래스
  const getButtonClass = (currentValue, buttonValue) => {
    return currentValue === buttonValue ? "button-active" : "button-inactive";
  };

  // 학점 옵션 배열
  const creditOptions = [0, 3, 6, 9, 12, 15, 18];

  // 학점 제한 검사 함수
  const checkTotalCredits = (majorCredits, generalCredits) => {
    const total = Number(majorCredits) + Number(generalCredits);
    return total <= 20;
  };

  const handleMajorCreditSelect = (value) => {
    const wouldBeValid = checkTotalCredits(value, formData.generalCredits);
    if (!wouldBeValid) {
      alert("전공학점과 교양학점의 합이 20학점을 초과할 수 없습니다.");
      return;
    }

    updateFormData({ majorCredits: value });
  };

  const handleGeneralCreditSelect = (value) => {
    const wouldBeValid = checkTotalCredits(formData.majorCredits, value);
    if (!wouldBeValid) {
      alert("전공학점과 교양학점의 합이 20학점을 초과할 수 없습니다.");
      return;
    }

    // 교양학점이 0일 경우 교양 영역 초기화
    if (value === "0") {
      updateFormData({
        generalCredits: value,
        generalAreas: [],
      });
    } else {
      updateFormData({ generalCredits: value });
    }
  };

  // 다음 단계로 진행하기 전 유효성 검사
  const handleNext = () => {
    // 전공과 교양 모두 0학점인 경우 체크
    if (formData.majorCredits === "0" && formData.generalCredits === "0") {
      alert("전공 또는 교양 학점을 선택해주세요.");
      return;
    }

    // 교양학점이 0인 경우 Step 4를 건너뛰고 제출
    if (formData.generalCredits === "0") {
      if (
        confirm(
          "교양학점을 선택하지 않아 교양 영역 선택 단계를 건너뛰고 제출합니다. 계속하시겠습니까?"
        )
      ) {
        // 여기에 제출 로직 추가
        alert("시간표 생성이 요청되었습니다.");
        return;
      }
      return;
    }

    goToNextStep();
  };

  const totalCredits =
    Number(formData.majorCredits) + Number(formData.generalCredits);
  const isExceedingRecommended = totalCredits > 18;
  return (
    <div className="step-container">
      <h2 className="step-title">Step 3: 학점 선택</h2>

      {/* 전공학점 버튼 */}
      <div className="step-section">
        <label className="step-label">
          전공학점 (선택: {formData.majorCredits}학점)
        </label>
        <div className="credits-grid">
          {creditOptions.map((credit) => (
            <button
              key={`major-${credit}`}
              type="button"
              className={
                formData.majorCredits === String(credit)
                  ? "button-active"
                  : "button-inactive"
              }
              onClick={() => handleMajorCreditSelect(String(credit))}
            >
              {credit}
            </button>
          ))}
        </div>
      </div>

      {/* 교양학점 버튼 */}
      <div className="step-section">
        <label className="step-label">
          교양학점 (선택: {formData.generalCredits}학점)
        </label>
        <div className="credits-grid">
          {creditOptions.map((credit) => (
            <button
              key={`general-${credit}`}
              type="button"
              className={
                formData.generalCredits === String(credit)
                  ? "button-active"
                  : "button-inactive"
              }
              onClick={() => handleGeneralCreditSelect(String(credit))}
            >
              {credit}
            </button>
          ))}
        </div>
      </div>

      {/* 합계 표시 */}
      <div className="credits-summary">
        <p className="summary-text">
          총 선택 학점: {totalCredits}학점
          {isExceedingRecommended && (
            <span className="warning-text">(주의: 18학점 초과)</span>
          )}
        </p>
      </div>

      {/* 이전/다음 단계 버튼 */}
      <div className="navigation-buttons">
        <button type="button" onClick={goToPrevStep} className="prev-button">
          이전 단계
        </button>
        <button type="button" onClick={handleNext} className="next-button">
          {formData.generalCredits === "0" ? "제출하기" : "다음 단계"}
        </button>
      </div>
    </div>
  );
};

export default Step3Credits;

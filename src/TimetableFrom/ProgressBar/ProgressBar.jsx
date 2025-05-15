//진행 상태 표시
import "./ProgressBar.css";

const ProgressBar = ({ currentStep, totalSteps }) => {
  // 단계별 제목
  const stepTitles = [
    "학년/학기 선택",
    "학과 선택",
    "학점 선택",
    "교양 영역 선택",
  ];

  // 단계 상태에 따른 클래스 결정
  const getStepClasses = (step) => {
    if (step < currentStep) return "progress-step-completed";
    if (step === currentStep) return "progress-step-active";
    return "progress-step-pending";
  };

  // 원형 상태에 따른 클래스 결정
  const getCircleClasses = (step) => {
    if (step < currentStep) return "progress-step-circle-completed";
    if (step === currentStep) return "progress-step-circle-active";
    return "progress-step-circle-pending";
  };

  // 제목 상태에 따른 클래스 결정
  const getTitleClasses = (step) => {
    if (step < currentStep) return "progress-title-completed";
    if (step === currentStep) return "progress-title-active";
    return "progress-title-pending";
  };

  // 정렬 클래스 결정
  const getAlignClass = (index) => {
    if (index === 0) return "text-align-left";
    if (index === totalSteps - 1) return "text-align-right";
    return "text-align-center";
  };

  return (
    <div className="progress-container">
      <div className="progress-steps">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`progress-step ${getStepClasses(step)}`}
            style={{ width: `${100 / totalSteps}%` }}
          >
            <div className={`progress-step-circle ${getCircleClasses(step)}`}>
              {step}
            </div>
          </div>
        ))}
      </div>

      {/* 진행 바 */}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>

      {/* 단계 제목 */}
      <div className="progress-titles">
        {stepTitles.map((title, i) => (
          <div
            key={i}
            className={`progress-title ${getTitleClasses(
              i + 1
            )} ${getAlignClass(i)}`}
            style={{ width: `${100 / totalSteps}%` }}
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;

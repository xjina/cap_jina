//timetableForm 메인 화면
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar/ProgressBar";
import Step1YearSemester from "./Step1YearSemester/Step1YearSemester";
import Step2Department from "./Step2Department/Step2Department";
import Step3Credits from "./Step3Credits/Step3Credits";
import Step4GeneralAreas from "./Step4GeneralAreas/Step4GeneralAreas";
import "./TimetableFormStyles.css";

const mapAreaIdToName = (areaId) => {
  const areaMap = {
    literature: "문학과예술",
    society: "사회와문화",
    global: "글로벌리더십",
    science: "과학과기술",
    career: "진로탐색/자기계발/창업",
    philosophy: "철학과역사",
    remote: "원격 강의 희망",
  };
  return areaMap[areaId] || areaId;
};

const TimetableForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState("slide-left");
  const [formData, setFormData] = useState({
    year: "2",
    semester: "1",
    department: "",
    departmentLabel: "학과 선택",
    majorCredits: "3",
    generalCredits: "3",
    generalAreas: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // 다음 단계로 이동
  const goToNextStep = () => {
    if (currentStep < 4) {
      setSlideDirection("slide-left");
      setCurrentStep(currentStep + 1);
    }
  };

  // 이전 단계로 이동
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setSlideDirection("slide-right");
      setCurrentStep(currentStep - 1);
    }
  };

  // 폼 데이터 업데이트
  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // 시간표 생성 요청
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://kmutime.duckdns.org/api/timetable",
        {
          department: formData.departmentLabel,
          grade: parseInt(formData.year),
          semester: parseInt(formData.semester),
          majorCredits: parseInt(formData.majorCredits),
          liberalCredits: parseInt(formData.generalCredits),
          liberalAreas: formData.generalAreas.map((areaId) =>
            mapAreaIdToName(areaId)
          ),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log("서버 응답:", data);

      // 응답 유효성 검사
      if (!data.success) {
        throw new Error("서버에서 시간표 생성에 실패했습니다.");
      }

      // 응답 데이터와 함께 결과 페이지로 이동
      navigate("/result", {
        state: {
          ...formData,
          serverResponse: data,
        },
      });
    } catch (error) {
      console.error("서버 요청 오류:", error);
      alert(`시간표 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      // 로딩 상태 종료
      setIsLoading(false);
    }
  };

  // 현재 단계에 따른 컴포넌트 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1YearSemester
            formData={formData}
            updateFormData={updateFormData}
            goToNextStep={goToNextStep}
          />
        );
      case 2:
        return (
          <Step2Department
            formData={formData}
            updateFormData={updateFormData}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
          />
        );
      case 3:
        return (
          <Step3Credits
            formData={formData}
            updateFormData={updateFormData}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
          />
        );
      case 4:
        return (
          <Step4GeneralAreas
            formData={formData}
            updateFormData={updateFormData}
            goToPrevStep={goToPrevStep}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <div className="form-inner">
        <div className="form-header">
          <h1 className="form-title">시간표 자동 생성</h1>
          <p className="form-subtitle">
            원하는 조건을 선택하시면 최적의 시간표를 추천해드립니다.
          </p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={4} />

        <div className="form-card">
          <div className={`form-content ${slideDirection}`}>{renderStep()}</div>
        </div>
      </div>
    </div>
  );
};

export default TimetableForm;
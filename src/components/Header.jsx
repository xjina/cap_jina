import React, { useState, useEffect, useRef } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const closeTimeoutRef = useRef(null)

  const toggleMenu = () => {
    if (isMenuOpen) {
      // 닫기 애니메이션 시작
      setIsClosing(true)
      
      // 애니메이션 완료 후 모달 상태 변경
      closeTimeoutRef.current = setTimeout(() => {
        setIsMenuOpen(false)
        setIsClosing(false)
      }, 300) // 애니메이션 지속 시간과 일치
    } else {
      setIsMenuOpen(true)
    }
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
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMenuOpen])

  return (
    <header className="bg-white shadow-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* 로고와 메뉴 버튼 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="계명대학교" className="h-12 sm:h-16 md:h-20 w-auto" />
            <div className="flex flex-col ml-2 sm:ml-4">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-kmu-blue">계명대학교</span>
              <span className="text-xs sm:text-sm text-gray-600 tracking-wider">KEIMYUNG UNIVERSITY</span>
            </div>
          </div>
          
          {/* 모바일 메뉴 버튼 */}
          <button 
            className="md:hidden p-2 rounded-md text-kmu-blue hover:bg-blue-50 z-50"
            onClick={toggleMenu}
            aria-label="메뉴 열기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          
          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex space-x-4">
            <button className="px-4 py-2 text-kmu-blue hover:bg-blue-50 rounded-md transition duration-200 font-medium">로그인</button>
            <button className="px-4 py-2 text-kmu-blue hover:bg-blue-50 rounded-md transition duration-200 font-medium">프로필 수정</button>
            <button className="px-4 py-2 text-kmu-blue hover:bg-blue-50 rounded-md transition duration-200 font-medium">설명</button>
            <button className="px-4 py-2 text-kmu-blue hover:bg-blue-50 rounded-md transition duration-200 font-medium">문의하기</button>
          </nav>
        </div>
        
        {/* 모바일 메뉴 모달 */}
        {isMenuOpen && (
          <>
            {/* 배경 오버레이 */}
            <div 
              className={`fixed inset-0 bg-black bg-opacity-50 z-40 modal-overlay ${isClosing ? 'closing' : ''}`}
              onClick={toggleMenu}
            ></div>
            
            {/* 모달 메뉴 */}
            <div className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 modal-content ${isClosing ? 'closing' : ''}`}>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <span className="text-xl font-bold text-kmu-blue">메뉴</span>
                  <button 
                    onClick={toggleMenu}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                    aria-label="메뉴 닫기"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col space-y-3">
                    <button className="w-full px-4 py-3 text-left text-kmu-blue hover:bg-blue-50 rounded-md transition duration-200 font-medium">로그인</button>
                    <button className="w-full px-4 py-3 text-left text-kmu-blue hover:bg-blue-50 rounded-md transition duration-200 font-medium">프로필 수정</button>
                    <button className="w-full px-4 py-3 text-left text-kmu-blue hover:bg-blue-50 rounded-md transition duration-200 font-medium">설명</button>
                    <button className="w-full px-4 py-3 text-left text-kmu-blue hover:bg-blue-50 rounded-md transition duration-200 font-medium">문의하기</button>
                  </div>
                </nav>
                
                <div className="p-4 border-t">
                  <div className="flex items-center">
                    <img src="/images/logo.png" alt="계명대학교" className="h-10 w-auto" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">© 2023 계명대학교</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default Header 
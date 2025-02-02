import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OnboardingPage from "./pages/onboarding";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import CustomerSignupPage from "./pages/signup/customer";
import OwnerSignupPage from "./pages/signup/owner";
import UserMain from "./pages/user/UserMain";
import BakeryDetail from "./pages/user/BakeryDetail";
import EditProfile from "./pages/owner/profile/EditProfile";
import EditSettlement from "./pages/owner/settlement/EditSettlement";
import MyPage from "./pages/owner/mypage/MyPage";
import EditStore from "./pages/owner/store/EditStore";
import PickupTime from "./pages/owner/pickup/PickupTime";
import CustomerSupport from "./pages/owner/support/CustomerSupport";
import MobileLayout from "./layouts/MobileLayout";
import "./styles/fonts.css";
import { ProfileProvider } from "./common/context/ProfileContext";

export default function App() {
  return (
    <ProfileProvider>
      <Router>
        <MobileLayout>
          <Routes>
            {/* 기본 라우트 설정 */}
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup/customer" element={<CustomerSignupPage />} />
            <Route path="/signup/owner" element={<OwnerSignupPage />} />

            {/* 사용자 관련 페이지 */}
            <Route path="/user" element={<UserMain />} />
            <Route path="/bakery/:bakery_id" element={<BakeryDetail />} />

            {/* 점주 관련 페이지 */}
            <Route path="/owner/profile/edit" element={<EditProfile />} />
            <Route path="/owner/settlement/edit" element={<EditSettlement />} />
            <Route path="/owner/mypage" element={<MyPage />} />
            <Route path="/owner/store/edit" element={<EditStore />} />
            <Route path="/owner/pickup-time" element={<PickupTime />} />
            <Route path="/owner/chatbot" element={<CustomerSupport />} />
          </Routes>
        </MobileLayout>
      </Router>
    </ProfileProvider>
  );
}

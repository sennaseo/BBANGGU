import React from "react"
import UserMain from "./pages/user/UserMain"
import BakeryDetail from "./pages/user/BakeryDetail"
import "./styles/fonts.css"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
import EditProfile from './pages/owner/profile/EditProfile';
import EditSettlement from './pages/owner/settlement/EditSettlement';
import MyPage from './pages/owner/mypage/MyPage';
import EditStore from './pages/owner/store/EditStore';
import PickupTime from './pages/owner/pickup/PickupTime';
import CustomerSupport from './pages/owner/support/CustomerSupport';

function App() {
  return (
    <Router>
      <MobileLayout>
        {/* 개발 중 테스트용 네비게이션 */}
        {/* <nav className="p-4 bg-gray-100">
          <Link to="/owner/profile/edit" className="text-blue-500 hover:text-blue-700 mr-4">
            프로필 수정
          </Link>
          <Link to="/owner/settlement/edit" className="text-blue-500 hover:text-blue-700">
            정산정보 수정
          </Link>
        </nav> */}
        <Routes>
          <Route path="/owner/profile/edit" element={<EditProfile />} />
          <Route path="/owner/settlement/edit" element={<EditSettlement />} />
          <Route path="/owner/mypage" element={<MyPage />} />
          <Route path="/owner/store/edit" element={<EditStore />} />
          <Route path="/owner/pickup-time" element={<PickupTime />} />
          <Route path="/owner/chatbot" element={<CustomerSupport />} />
          <Route path="/" element={<UserMain />} />
          <Route path="/bakery/:bakery_id" element={<BakeryDetail />} />
        </Routes>
      </MobileLayout>
    </Router>
  );
}

export default App


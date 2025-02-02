import React from "react"
import UserMain from "./pages/user/main/UserMain"
import BakeryDetail from "./pages/user/detail/BakeryDetail"
import "./styles/fonts.css"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
import EditProfile from './pages/owner/profile/EditProfile';
import EditSettlement from './pages/owner/settlement/EditSettlement';
import MyPage from './pages/owner/mypage/MyPage';
import EditStore from './pages/owner/store/EditStore';
import PickupTime from './pages/owner/pickup/PickupTime';
import CustomerSupport from './pages/owner/support/CustomerSupport';
import UserReview from "./pages/user/review/UserReview"

function App() {
  return (
    <Router>
      <MobileLayout>
        <Routes>
          <Route path="/owner/profile/edit" element={<EditProfile />} />
          <Route path="/owner/settlement/edit" element={<EditSettlement />} />
          <Route path="/owner/mypage" element={<MyPage />} />
          <Route path="/owner/store/edit" element={<EditStore />} />
          <Route path="/owner/pickup-time" element={<PickupTime />} />
          <Route path="/owner/chatbot" element={<CustomerSupport />} />
          <Route path="/" element={<UserMain />} />
          <Route path="/bakery/:bakery_id" element={<BakeryDetail />} />
          <Route path="/bakery/:bakery_id/reviews" element={<UserReview />} />
        </Routes>
      </MobileLayout>
    </Router>
  );
}

export default App


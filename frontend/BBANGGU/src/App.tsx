import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OnboardingPage from "./pages/onboarding";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signup";
import CustomerSignupPage from "./pages/signup/customer";
import OwnerSignupPage from "./pages/signup/owner";
import UserMain from "./pages/user/main/UserMain";
import BakeryDetail from "./pages/user/detail/BakeryDetail";
import EditProfile from "./pages/owner/profile/EditProfile";
import EditSettlement from "./pages/owner/settlement/EditSettlement";
import MyPage from "./pages/owner/mypage/MyPage";
import EditStore from "./pages/owner/store/EditStore";
import PickupTime from "./pages/owner/pickup/PickupTime";
import CustomerSupport from "./pages/owner/support/CustomerSupport";
import MobileLayout from "./layouts/MobileLayout";
import ReportPage from "./pages/owner/report/ReportPage"
import UserReview from "./pages/user/review/UserReview";
import "./styles/fonts.css";
import { ProfileProvider } from "./common/context/ProfileContext";
import UserMyPage from "./pages/user/mypage/UserMyPage";
import { ReservationHistory } from "./pages/user/mypage/reservation/ReservationHistory"
import { ReservationDetail } from "./pages/user/mypage/reservation/ReservationDetail"
import { UserEditProfile } from "./pages/user/mypage/editprofile/editprofile"
import OwnerMainPage from "./pages/owner/mainpage/OwnerMainPage";
import  { UserPayment } from "./pages/user/payment/UserPayment"
import { MapPage } from "./pages/user/map/MapPage";
import { UserSaveReport } from "./pages/user/mypage/usersavereport/UserSaveReport"
import { Notification } from "./pages/user/mypage/notification/Notification"
import PackageGuide from './pages/owner/package/PackageGuide';
import PackagePreview from './pages/owner/package/PackagePreview';
import FavoriteBakery from "./pages/user/favorite/FavoriteBakery";
import UserCustomerSupport from "./pages/user/mypage/support/CustomerSupport";
import PackageLoading from './pages/owner/package/PackageLoading';
import PackageRegister from './pages/owner/package/PackageRegister';
import { RecoilRoot } from 'recoil';
import PackageSalesSetting from './pages/owner/package/PackageSalesSetting';
import PackageSettingPage from './pages/owner/package/PackageSettingPage';
import BreadRegisterPage from './pages/owner/bread/BreadRegisterPage';
import { InstallPWA } from './components/InstallPWA';
import UserMyReview from "./pages/user/mypage/myreview/UserMyReview";
import { WriteReview } from "./pages/user/review/writereview/WriteReview";
import { ReviewDetail } from "./pages/user/review/ReviewDetail";
import { PaymentSuccess } from "./pages/user/payment/PaymentSuccess";
import { PaymentFail } from "./pages/user/payment/PaymentFail";
import KakaoCallback from './pages/oauth/KakaoCallback';

export default function App() {
  return (
    <RecoilRoot>
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
            <Route path="/user/bakery/:bakeryId" element={<BakeryDetail />} />
            <Route path="/user/bakery/:bakeryId/reviews" element={<UserReview />} />
            <Route path="/user/:userId/mypage" element={<UserMyPage />} />
            <Route path="/user/:userId/mypage/edit" element={<UserEditProfile />} />
            <Route path="/user/:userId/mypage/user-customer-support" element={<UserCustomerSupport />} />
            <Route path="/user/:userId/mypage/save-report" element={<UserSaveReport />} />
            <Route path="/user/:userId/mypage/notifications" element={<Notification />} />
            <Route path="/user/:userId/mypage/reservations" element={<ReservationHistory />} />
            <Route path="/user/:userId/mypage/reservation/:reservationId" element={<ReservationDetail />} />
            <Route path="/user/:userId/mypage/myreviews" element={<UserMyReview />} />
            <Route path="/user/:userId/mypage/reservation/:reservationId/write-review" element={<WriteReview />} />
            <Route path="/user/:userId/mypage/reviews/:reservationId" element={<ReviewDetail />} />
            <Route path="/user/:userId/favorite" element={<FavoriteBakery />} />
            <Route path="/user/payment/:bakeryId" element={<UserPayment />} />
            <Route path="/user/map" element={<MapPage />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/fail" element={<PaymentFail />} />
            <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />


              {/* 점주 관련 페이지 */}
              <Route path="/owner/profile/edit" element={<EditProfile />} />
              <Route path="/owner/settlement/edit" element={<EditSettlement />} />
              <Route path="/owner/mypage" element={<MyPage />} />
              <Route path="/owner/store/edit" element={<EditStore />} />
              <Route path="/owner/pickup-time" element={<PickupTime />} />
              <Route path="/owner/chatbot" element={<CustomerSupport />} />
              <Route path="/owner/report" element={<ReportPage />} />
              <Route path="/owner/main" element={<OwnerMainPage />} />
              <Route path="/owner/package/guide" element={<PackageGuide />} />
              <Route path="/owner/package/preview" element={<PackagePreview />} />
              <Route path="/owner/package/loading" element={<PackageLoading />} />
              <Route path="/owner/package/register" element={<PackageRegister />} />
              <Route path="/owner/package/sales-setting" element={<PackageSalesSetting />} />
              <Route path="/owner/package/setting" element={<PackageSettingPage />} />
              <Route path="/owner/bread/register" element={<BreadRegisterPage />} />
            </Routes>
            <InstallPWA />
          </MobileLayout>
        </Router>
      </ProfileProvider>
    </RecoilRoot>
  );
}

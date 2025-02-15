"use client"

import { useState, useEffect } from "react"
import { Bell, User, X } from "lucide-react"
import { MapView } from "../../../components/user/map/MapView"
import { StoreCard } from "../../../components/user/map/StoreCard"
import UserBottomNavigation from "../../../components/user/navigations/bottomnavigation/UserBottomNavigation"
import { UserAddressApi } from "../../../api/user/map/UserAddressApi"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchBakeryList, BakeryInfo } from '../../../store/slices/bakerySlice';
import { setUserInfo } from '../../../store/slices/userSlice';

interface PostcodeData {
  roadAddress: string;
  bname: string;
  buildingName: string;
  apartment: string;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: PostcodeData) => void }) => { open: () => void };
    };
  }
}

export function MapPage() {
  const [selectedStore, setSelectedStore] = useState<BakeryInfo | null>(null)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isPostcodeLoaded, setIsPostcodeLoaded] = useState(false)
  const [address, setAddress] = useState("")
  const [addressDetail, setAddressDetail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>();
  const { bakeryList, loading, error: bakeryError } = useSelector((state: RootState) => state.bakery);
  const { userInfo, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [userAddress, setUserAddress] = useState<string>("위치를 설정해주세요");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBakeries, setFilteredBakeries] = useState<BakeryInfo[]>([]);

  // Daum Postcode 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    script.async = true
    script.onload = () => setIsPostcodeLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    // 가게 정보 로드
    dispatch(fetchBakeryList());
  }, [dispatch]);

  // bakeryList가 변경될 때마다 콘솔에 출력
  useEffect(() => {
    console.log('현재 저장된 가게 정보:', bakeryList);
  }, [bakeryList]);

  useEffect(() => {
    // 로그인 상태 확인
    console.log('현재 로그인한 사용자:', userInfo);
    console.log('로그인 상태:', isAuthenticated);
  }, [userInfo, isAuthenticated]);

  // 컴포넌트 마운트 시 사용자 주소 설정
  useEffect(() => {
    if (userInfo?.addressRoad) {
      setUserAddress(userInfo.addressRoad);
    }
  }, [userInfo]);

  // 검색어가 변경될 때마다 필터링
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBakeries(bakeryList);
      return;
    }

    const filtered = bakeryList.filter(bakery => 
      bakery.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBakeries(filtered);
  }, [searchQuery, bakeryList]);

  // 주소 검색 팝업
  const openAddressSearch = () => {
    if (!isPostcodeLoaded) {
      console.error("Daum Postcode script is not loaded yet")
      return
    }

    new window.daum.Postcode({
      oncomplete: (data: PostcodeData) => {
        const roadAddr = data.roadAddress
        let extraRoadAddr = ""

        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname
        }
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraRoadAddr += extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName
        }
        if (extraRoadAddr !== "") {
          extraRoadAddr = " (" + extraRoadAddr + ")"
        }

        setAddress(roadAddr + extraRoadAddr)
      },
    }).open()
  }

  // 주소 등록 처리
  const handleAddressSubmit = async () => {
    console.log('로그인 상태 체크:', {
      isAuthenticated,
      userInfo,
      accessToken: localStorage.getItem('accessToken')
    });

    if (!isAuthenticated || !localStorage.getItem('accessToken')) {
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
      return;
    }

    if (!address || !addressDetail) {
      setError('주소를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await UserAddressApi.updateAddress({
        addressRoad: address,
        addressDetail: addressDetail
      });
      
      console.log('주소 업데이트 성공:', response);
      
      // 사용자 정보 업데이트
      if (userInfo) {
        dispatch(setUserInfo({
          ...userInfo,
          addressRoad: address,
          addressDetail: addressDetail
        }));
      }

      // 주소 업데이트 후 가게 목록 다시 불러오기
      console.log('가게 목록 새로고침 시작');
      await dispatch(fetchBakeryList()).unwrap();
      console.log('가게 목록 새로고침 완료');

      setIsAddressModalOpen(false);
    } catch (err: any) {
      console.error('주소 업데이트 실패:', err);
      if (err.message.includes('로그인이 필요합니다')) {
        window.location.href = '/login';
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkerClick = (storeInfo: BakeryInfo) => {
    setSelectedStore(storeInfo)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white">
        <div className="max-w-[430px] mx-auto flex items-center justify-between p-4">
          <button 
            className="flex items-center text-[#FF9F43]"
            onClick={() => setIsAddressModalOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{userAddress}</span>
          </button>
          <div className="flex items-center gap-4">
            <button>
              <Bell className="w-6 h-6" />
            </button>
            <button>
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="max-w-[430px] mx-auto px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="가게 이름을 입력해주세요"
              className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-200"
            />
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </header>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">주소 설정</h2>
              <button onClick={() => setIsAddressModalOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  도로명 주소
                </label>
                <input
                  type="text"
                  value={address}
                  className="w-full p-2 border border-gray-300 rounded-xl cursor-pointer"
                  placeholder="클릭하여 주소 검색"
                  onClick={openAddressSearch}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상세 주소
                </label>
                <input
                  type="text"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                  placeholder="상세 주소를 입력하세요"
                />
              </div>
              <button 
                className="w-full bg-[#FF9F43] text-white py-2 rounded-full hover:bg-[#f39539] disabled:opacity-50"
                onClick={handleAddressSubmit}
                disabled={isLoading}
              >
                {isLoading ? '등록 중...' : '주소 등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <main className="flex-1 mt-[116px] relative w-full h-full">
        <div className="absolute inset-0">
          {loading ? (
            <div>로딩 중...</div>
          ) : bakeryError ? (
            <div>에러: {bakeryError}</div>
          ) : (
            <MapView 
              bakeries={filteredBakeries} 
              onMarkerClick={handleMarkerClick}
              userAddress={userInfo?.addressRoad}
            />
          )}
        </div>
      </main>

      {/* Store Card */}
      <StoreCard isVisible={!!selectedStore} store={selectedStore} />
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className="max-w-[430px] mx-auto">
          <UserBottomNavigation/>
        </div>
      </div>
    </div>
  )
}


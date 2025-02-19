import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../../components/user/payment/Header";
import { RandomMenu } from "../../../components/user/payment/RandomMenu";
import { PickupTime } from "../../../components/user/payment/PickupTime";
import { PaymentMethod } from "../../../components/user/payment/PaymentMethod";
import { PaymentComplete } from "../../../components/user/payment/PaymentComplete";
import { PackageSelect } from "../../../components/user/payment/PackageSelect";
import { fetchBakeryDetail } from "../../../services/user/detail/bakeryDetailService";
import { BakeryInfo } from "../../../store/slices/bakerySlice";
import { ReservationApi } from "../../../api/user/reservation/PaymentApi";

export function UserPayment() {
  const { bakeryId } = useParams<{ bakeryId: string }>();
  const [step, setStep] = useState(0);
  const [bakeryData, setBakeryData] = useState<BakeryInfo | null>(null);
  const [orderInfo, setOrderInfo] = useState({
    quantity: 1,
    totalPrice: 0,
    reservationId: 0,
  });
  const navigate = useNavigate();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // 컴포넌트 마운트 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadBakeryDetail = async () => {
      try {
        const data = await fetchBakeryDetail(Number(bakeryId));
        // 데이터 변환
        const transformedData: BakeryInfo = {
          ...data,
          price: data.price || 0,
          packageName: data.package?.data[0].name || "",
          bakeryName: data.name || "",
        };
        setBakeryData(transformedData);
      } catch (err) {
        console.error("베이커리 정보 로드 실패:", err);
      }
    };

    loadBakeryDetail();
  }, [bakeryId]);

  useEffect(() => {
    // 뒤로가기 이벤트 핸들러
    const handlePopState = async (event: PopStateEvent) => {
      if (isProcessingPayment) {
        event.preventDefault();

        try {
          // // 진행 중인 결제 취소
          // await cancelPaymentProcess(orderInfo.reservationId);

          // // 예약 상태 롤백
          // await rollbackReservation(orderInfo.reservationId);

          // 사용자에게 알림
          alert("결제가 취소되었습니다.");
        } catch (error) {
          console.error("결제 취소 처리 실패:", error);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isProcessingPayment, orderInfo.reservationId]);

  const handleBack = async () => {
    if (step > 2 && sessionStorage.getItem("currentReservationId")) {
      // 예약 후 단계에서는 사용자 확인 후 예약 취소
      const confirmCancel = window.confirm("예약을 취소하시겠습니까?");
      if (confirmCancel) {
        await handleReservationCancel();
        navigate(-1);
      }
      return;
    }

    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNext = () => {
    setStep(step + 1); // 다음 단계로 이동
  };

  const handleComplete = () => {
    navigate("/user"); // 홈으로 이동
  };

  const handleReservationCancel = async () => {
    if (!sessionStorage.getItem("currentReservationId")) return;

    try {
      await ReservationApi.uncheckReservation(
        Number(sessionStorage.getItem("currentReservationId")),
        orderInfo.quantity
      );
      sessionStorage.removeItem("currentReservationId");
      setOrderInfo({
        quantity: 0,
        totalPrice: 0,
        reservationId: 0,
      });
    } catch (error) {
      console.error("결제대기 취소 실패:", error);
    }
  };

  const handlePackageSelect = (
    quantity: number,
    totalPrice: number,
    reservationId: number
  ) => {
    setOrderInfo({ quantity, totalPrice, reservationId });
    setStep(step + 1);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white">
      <Header onBack={handleBack} />
      {step === 0 && <RandomMenu onConfirm={handleNext} />}
      {step === 1 && <PickupTime onConfirm={handleNext} />}
      {step === 2 && (
        <PackageSelect
          bakeryData={bakeryData}
          onConfirm={handlePackageSelect}
        />
      )}
      {step === 3 && (
        <PaymentMethod
          totalPrice={orderInfo.totalPrice}
          reservationId={orderInfo.reservationId}
          onPaymentStart={() => setIsProcessingPayment(true)}
          onPaymentEnd={() => setIsProcessingPayment(false)}
        />
      )}
      {step === 4 && <PaymentComplete onConfirm={handleComplete} />}
    </div>
  );
}

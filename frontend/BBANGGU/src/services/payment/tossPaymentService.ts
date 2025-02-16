const clientKey = "test_ck_d46qopOB896qMYBeYgj53ZmM75y0";

interface PaymentProps {
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail: string;
  customerName: string;
  customerMobilePhone: string;
  successUrl: string;
  failUrl: string;
}

export const requestTossPayment = async ({
  amount,
  orderId,
  orderName,
  customerEmail,
  customerName,
  customerMobilePhone,
  successUrl,
  failUrl
}: PaymentProps) => {
  const tossPayments = window.TossPayments(clientKey);
  
  try {
    await tossPayments.checkout({
      amount,
      orderId,
      orderName,
      successUrl,
      failUrl,
      customerEmail,
      customerName,
      customerMobilePhone,
      paymentMethod: 'CARD'
    });
  } catch (error) {
    console.error('결제 요청 실패:', error);
    throw error;
  }
}; 
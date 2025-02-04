import React from 'react';
import { useCustomerSort } from '../../../hooks/owner/useCustomerSort';
import { BreadPackageHeader } from './components/BreadPackageHeader';
import { BreadPackageInfo } from './components/BreadPackageInfo';
import { CustomerList } from './components/CustomerList';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';

interface Customer {
  id: number;
  name: string;
  email: string;
  paymentTime: string;
  isPickedUp: boolean;
  breadCount: number;
}

const OwnerMainPage: React.FC = () => {
  const initialCustomers: Customer[] = [
    { id: 1, name: '서유민', email: 'youmin77@naver.com', paymentTime: '19:15', isPickedUp: false, breadCount: 1 },
    { id: 2, name: '신은찬', email: 'youmin77@naver.com', paymentTime: '19:20', isPickedUp: false, breadCount: 1 },
    { id: 3, name: '김유진', email: 'youmin77@naver.com', paymentTime: '19:25', isPickedUp: false, breadCount: 1 },
    { id: 4, name: '정나금', email: 'youmin77@naver.com', paymentTime: '19:30', isPickedUp: false, breadCount: 1 },
    { id: 5, name: '정나금', email: 'youmin77@naver.com', paymentTime: '19:35', isPickedUp: false, breadCount: 1 },
    { id: 6, name: '김휘동', email: 'youmin77@naver.com', paymentTime: '19:40', isPickedUp: false, breadCount: 1 },
  ];

  const { 
    customers, 
    sortByPaymentTime, 
    togglePickup, 
    handleSort 
  } = useCustomerSort(initialCustomers);

  return (
    <div className="pb-16">
      <div className="p-4">
        <BreadPackageHeader />
        <BreadPackageInfo />
        <CustomerList 
          customers={customers}
          sortByPaymentTime={sortByPaymentTime}
          onTogglePickup={togglePickup}
          onSort={handleSort}
        />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default OwnerMainPage;
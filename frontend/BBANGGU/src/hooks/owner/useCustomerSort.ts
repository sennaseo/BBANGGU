import { useState } from 'react';
import type { Customer } from '../../types/owner';

export const useCustomerSort = (initialCustomers: Customer[]) => {
  const [sortByPaymentTime, setSortByPaymentTime] = useState(true);
  const [customers, setCustomers] = useState(
    [...initialCustomers].sort((a, b) => a.paymentTime.localeCompare(b.paymentTime))
  );

  const sortCustomers = (customerList: Customer[], byPaymentTime: boolean) => {
    if (byPaymentTime) {
      return [...customerList].sort((a, b) => a.paymentTime.localeCompare(b.paymentTime));
    } else {
      return [...customerList].sort((a, b) => {
        if (a.isPickedUp === b.isPickedUp) {
          return a.paymentTime.localeCompare(b.paymentTime);
        }
        return a.isPickedUp ? 1 : -1;
      });
    }
  };

  const togglePickup = (customerId: number) => {
    setCustomers(prevCustomers => {
      const updatedCustomers = prevCustomers.map(customer =>
        customer.id === customerId
          ? { ...customer, isPickedUp: !customer.isPickedUp }
          : customer
      );
      return sortCustomers(updatedCustomers, sortByPaymentTime);
    });
  };

  const handleSort = () => {
    setSortByPaymentTime(!sortByPaymentTime);
    setCustomers(prevCustomers => sortCustomers(prevCustomers, !sortByPaymentTime));
  };

  return { customers, sortByPaymentTime, togglePickup, handleSort };
};

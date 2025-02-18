import { ApiResponse } from '../../types/api';
import instance from '../axios';

export interface BakeryInfo {
  bakeryId: number;
  userId: number;
  name: string;
  description: string;
  businessRegistrationNumber: string;
  addressRoad: string;
  addressDetail: string;
  bakeryImageUrl: string | null;
  bakeryBackgroundImgUrl: string | null;
  star: number;
  reviewCnt: number;
}

export const getBakeryByOwner = async (): Promise<BakeryInfo> => {
  try {
    const response = await instance.get<ApiResponse<BakeryInfo>>('/user/bakery');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching bakery info:', error);
    throw error;
  }
};

export interface PickupTime {
  startTime: string;  // "HH:mm" 형식
  endTime: string;    // "HH:mm" 형식
}

export const getPickupTime = async (bakeryId: number): Promise<PickupTime> => {
  try {
    const response = await instance.get<ApiResponse<PickupTime>>(`/bakery/${bakeryId}/pickup`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching pickup time:', error);
    throw error;
  }
};

export interface PickupTimeUpdate {
  [key: string]: { startTime: string; endTime: string };
}

export const updatePickupTime = async (bakeryId: number, startTime: string, endTime: string): Promise<void> => {
  try {
    // 오늘 날짜의 요일 구하기
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const dayOfWeek = days[today];

    const data: PickupTimeUpdate = {
      [dayOfWeek]: { startTime, endTime }
    };

    console.log('Updating pickup time:', data);
    
    const response = await instance.put<ApiResponse<void>>(
      `/bakery/${bakeryId}/pickup`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error('Error updating pickup time:', error);
    throw error;
  }
}; 
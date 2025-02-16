import instance from '../axios';

interface PickupTime {
  startTime: string;
  endTime: string;
}

interface PickupTimeRequest {
  monday?: PickupTime;
  tuesday?: PickupTime;
  wednesday?: PickupTime;
  thursday?: PickupTime;
  friday?: PickupTime;
  saturday?: PickupTime;
  sunday?: PickupTime;
}

interface PickupTimeAllResponse {
  sunday: PickupTime | null;
  saturday: PickupTime | null;
  tuesday: PickupTime | null;
  wednesday: PickupTime | null;
  thursday: PickupTime | null;
  friday: PickupTime | null;
  monday: PickupTime | null;
}

// 픽업 시간 등록
export const createPickupTime = async (bakeryId: number, data: PickupTimeRequest): Promise<void> => {
  try {
    const response = await instance.post(`/bakery/${bakeryId}/pickup`, data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating pickup time:', error);
    throw error;
  }
};

// 픽업 시간 조회 (오늘)
export const getPickupTime = async (bakeryId: number): Promise<PickupTime | null> => {
  try {
    const response = await instance.get(`/bakery/${bakeryId}/pickup`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching pickup time:', error);
    throw error;
  }
};

// 픽업 시간 수정
export const updatePickupTime = async (bakeryId: number, data: PickupTimeRequest): Promise<void> => {
  try {
    const response = await instance.put(`/bakery/${bakeryId}/pickup`, data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating pickup time:', error);
    throw error;
  }
};

// 픽업 시간 전체 조회
export const getAllPickupTimes = async (bakeryId: number): Promise<PickupTimeAllResponse> => {
  try {
    const response = await instance.get(`/bakery/${bakeryId}/pickup_all`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all pickup times:', error);
    throw error;
  }
};

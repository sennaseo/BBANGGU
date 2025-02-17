import { saveReportApi } from "../../../../api/user/mypage/save-report/saveReportApi";
import { EchoSave } from "../../../../store/slices/echosaveSlice";

export async function getSaveReport(): Promise<EchoSave> {
    try {
        const response = await saveReportApi.getSaveReport();
        return response;
    } catch (error) {
        console.error('절약 리포트 조회 실패:', error);
        throw error;
    }
}

export function calculateImpact(price: number): { reducedCo2e: number, waterSaving: number, reducedTravelDistance: number, savedMoney: number } {
    const reducedCo2e = 0.0001 * price;          // 예: 5000원 -> 0.5kg CO2 절감
    const waterSaving = 0.03 * price;              // 예: 5000원 -> 150리터 절약
    const reducedTravelDistance = 0.00005 * price; // 예: 5000원 -> 0.25km 감소
    const savedMoney = 0.1 * price;                // 예: 5000원 -> 500원 절약
    return { reducedCo2e, waterSaving, reducedTravelDistance, savedMoney };
}

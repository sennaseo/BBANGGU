import { reviewApi } from "../../../api/user/review/reviewApi";
import { BakeryRating, ReviewType } from "../../../types/bakery";

export async function getReviews(bakeryId: number): Promise<ReviewType[]> {
    try {
        console.log("📌 리뷰 데이터 조회 시작!!")
        const reviews = await reviewApi.getReviews(bakeryId);
        console.log("📌 가져온 리뷰 데이터:", reviews);
        return reviews.map(review => ({
            ...review,
            formattedDate: new Date(review.createdAt).toLocaleString() // 날짜 포맷팅 추가
        }));
    } catch (error) {
        console.error("리뷰 조회 실패:", error);
        throw error;
    }
}

export async function getAverageRating(bakeryId: number): Promise<BakeryRating> {
    try {
        const averageRating = await reviewApi.getAverageRating(bakeryId);
        return averageRating;
    } catch (error) {
        console.error("평균별점 조회 실패:", error);
        throw error;
    }
}

export async function getReviewAndRating(bakeryId: number): Promise<{ reviews: ReviewType[]; averageRating: BakeryRating }> {
    try {
        const [reviews, averageRating] = await Promise.all([
            getReviews(bakeryId),
            getAverageRating(bakeryId)
        ]);
        return { reviews, averageRating };
    } catch (error) {
        console.error("리뷰 및 평균 평점 조회 실패:", error);
        throw error;
    }  
}

export async function deleteReview(reviewId: number): Promise<void> {
    try {
        await reviewApi.deleteReview(reviewId);
    } catch (error) {
        console.error("리뷰 삭제 실패:", error);
        throw error;
    }
}

export async function getReviewByReservationId(userInfo: string, reservationId: string): Promise<ReviewType | undefined> {
    try {
        const reviews = await reviewApi.getUserReviews(userInfo);
        console.log("reviews", reviews);
        const review = reviews.data.find(review => review.reservationId.toString() === reservationId);
        console.log("review", review);
        return review;
    } catch (error) {
        console.error("리뷰 조회 실패:", error);
        throw error;
    }
}
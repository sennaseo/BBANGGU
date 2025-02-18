import { reviewApi } from "../../../api/user/review/reviewApi";
import { BakeryRating, ReviewType } from "../../../types/bakery";
import { UserInfo } from "../../../types/user";

export async function getReviews(bakeryId: number): Promise<ReviewType[]> {
    try {
        const reviews = await reviewApi.getReviews(bakeryId);
        return reviews;
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
        const review = reviews.find(review => review.reservationId.toString() === reservationId);
        console.log("review", review);
        return review;
    } catch (error) {
        console.error("리뷰 조회 실패:", error);
        throw error;
    }
}

interface RatingSummaryProps {
    averageRating: number
    ratingCounts: number[]
    totalReviews: number
  }
  
  export default function RatingSummary({ averageRating, ratingCounts, totalReviews }: RatingSummaryProps) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mx-5 mb-4">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <span className="text-[48px] font-bold leading-none mb-2">{averageRating.toFixed(1)}</span>
            <div className="flex gap-0.5">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-[#FFB933] fill-current"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
            </div>
          </div>
          <div className="flex-1">
            {ratingCounts
              .map((count, index) => ({
                stars: 5 - index,
                count,
                percentage: (count / totalReviews) * 100,
              }))
              .reverse()
              .map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-2 mb-1 last:mb-0">
                  <span className="text-xs w-3">{6-stars}</span>
                  <div className="flex-1 h-2 bg-[#D9D9D9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFB933] rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs text-[#757575] w-10">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }
  
  
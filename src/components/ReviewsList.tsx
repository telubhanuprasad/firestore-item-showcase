
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { getReviewsForItem } from '../lib/reviews';
import { Review } from '../types/review';

interface ReviewsListProps {
  itemId: string;
  refreshTrigger: number;
}

const ReviewsList = ({ itemId, refreshTrigger }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      console.log("ReviewsList: Fetching reviews for item:", itemId);
      setLoading(true);
      try {
        const fetchedReviews = await getReviewsForItem(itemId);
        console.log("ReviewsList: Received reviews:", fetchedReviews);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("ReviewsList: Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchReviews();
    }
  }, [itemId, refreshTrigger]);

  console.log("ReviewsList: Current state - loading:", loading, "reviews count:", reviews.length);

  if (loading) {
    return <div className="text-center text-gray-500 py-4">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No reviews yet for this item.</p>
        <p className="text-sm mt-2">Be the first to review!</p>
        <p className="text-xs mt-2 text-gray-400">Item ID: {itemId}</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= Math.round(averageRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{review.reviewerName}</h4>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {review.createdAt.toLocaleDateString()}
                </Badge>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;

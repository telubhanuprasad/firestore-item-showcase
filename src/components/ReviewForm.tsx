
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addReview } from '../lib/reviews';
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface ReviewFormProps {
  itemId: string;
  onReviewAdded: () => void;
}

const ReviewForm = ({ itemId, onReviewAdded }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !comment.trim() || !reviewerName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select a rating.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(itemId, rating, comment.trim(), reviewerName.trim());
      toast({
        title: "Review Added",
        description: "Your review has been successfully added!",
      });
      
      // Reset form
      setRating(0);
      setComment('');
      setReviewerName('');
      onReviewAdded();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">Add Your Review</h3>
      
      <div>
        <Label htmlFor="reviewerName">Your Name</Label>
        <Input
          id="reviewerName"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="Enter your name"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label>Rating</Label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              disabled={isSubmitting}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="comment">Your Review</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this item..."
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Adding Review...' : 'Add Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;

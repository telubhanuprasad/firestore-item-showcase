
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Review } from '../types/review';

export const addReview = async (itemId: string, rating: number, comment: string, reviewerName: string) => {
  try {
    console.log("Adding review to item:", itemId);
    const docRef = await addDoc(collection(db, "reviews"), {
      itemId,
      rating,
      comment,
      reviewerName,
      createdAt: new Date()
    });
    console.log("Review added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding review: ", error);
    throw error;
  }
};

export const getReviewsForItem = async (itemId: string): Promise<Review[]> => {
  try {
    console.log("Fetching reviews for item:", itemId);
    const q = query(
      collection(db, "reviews"), 
      where("itemId", "==", itemId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Review[];
    console.log("Fetched reviews:", reviews);
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

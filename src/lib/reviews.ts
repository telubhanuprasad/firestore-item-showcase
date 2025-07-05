import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Review } from '../types/review';

export const addReview = async (itemId: string, rating: number, comment: string, reviewerName: string) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), {
      itemId,
      rating,
      comment,
      reviewerName,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding review: ", error);
    throw error;
  }
};

export const getReviewsForItem = async (itemId: string): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("itemId", "==", itemId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      };
    }) as Review[];
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};


import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Review } from '../types/review';

export const addReview = async (itemId: string, rating: number, comment: string, reviewerName: string) => {
  try {
    console.log("Adding review to item:", itemId);
    console.log("Review data:", { itemId, rating, comment, reviewerName });
    const docRef = await addDoc(collection(db, "reviews"), {
      itemId,
      rating,
      comment,
      reviewerName,
      createdAt: serverTimestamp()
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
    console.log("Fetching reviews for item ID:", itemId);
    const q = query(
      collection(db, "reviews"), 
      where("itemId", "==", itemId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    console.log("Query snapshot size:", querySnapshot.size);
    
    const reviews = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log("Review document data:", data);
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      };
    }) as Review[];
    
    console.log("Fetched reviews for item", itemId, ":", reviews);
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    console.error("Error details:", error);
    return [];
  }
};

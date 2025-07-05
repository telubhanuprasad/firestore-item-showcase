
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, DollarSign } from "lucide-react";

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
}

const ItemList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Fetching items from Firestore...");
        const querySnapshot = await getDocs(collection(db, "items"));
        const data = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Item[];
        console.log("Fetched items:", data);
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please check your Firebase configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <Package className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Items</h2>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Package className="h-10 w-10 text-blue-600" />
          Items from Firestore
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our collection of premium items, sourced directly from our Firebase database
        </p>
        <div className="mt-4">
          <Badge variant="secondary" className="text-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'} available
          </Badge>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
          <p className="text-gray-500">
            It looks like there are no items in your Firestore collection yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <Card 
              key={item.id} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-start justify-between">
                  <span className="flex-1">{item.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    ID: {item.id.slice(0, 6)}...
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-xl font-bold text-green-700">
                      {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Premium Quality
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;

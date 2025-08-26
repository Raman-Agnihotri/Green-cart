import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const { user, axios, addToCart } = useAppContext();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const { data } = await axios.get('/api/wishlist/get');
            if (data.success) {
                setWishlistItems(data.wishlist);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error fetching wishlist');
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await axios.post('/api/wishlist/remove', { productId });
            if (data.success) {
                setWishlistItems(prev => prev.filter(item => item._id !== productId));
                toast.success('Removed from wishlist');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error removing from wishlist');
        }
    };

    const moveAllToCart = () => {
        wishlistItems.forEach(item => {
            addToCart(item._id);
        });
        toast.success('All items moved to cart');
    };

    if (!user) {
        return (
            <div className="mt-16 text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">Please Login</h2>
                <p className="text-gray-600">You need to be logged in to view your wishlist.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mt-16 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading wishlist...</p>
            </div>
        );
    }

    return (
        <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-medium">My Wishlist</h1>
                    <p className="text-gray-600 mt-1">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                    </p>
                </div>
                
                {wishlistItems.length > 0 && (
                    <button
                        onClick={moveAllToCart}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition"
                    >
                        Move All to Cart
                    </button>
                )}
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                        <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">
                        Start adding items to your wishlist to save them for later.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((product) => (
                        <div key={product._id} className="relative group">
                            <ProductCard product={product} />
                            <button
                                onClick={() => removeFromWishlist(product._id)}
                                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                title="Remove from wishlist"
                            >
                                <svg
                                    className="w-4 h-4 text-red-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;

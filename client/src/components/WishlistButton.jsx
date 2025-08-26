import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const WishlistButton = ({ productId, className = "" }) => {
    const { user, axios } = useAppContext();
    const [inWishlist, setInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && productId) {
            checkWishlistStatus();
        }
    }, [user, productId]);

    const checkWishlistStatus = async () => {
        try {
            const { data } = await axios.get(`/api/wishlist/check/${productId}`);
            if (data.success) {
                setInWishlist(data.inWishlist);
            }
        } catch (error) {
            console.log('Error checking wishlist status:', error);
        }
    };

    const toggleWishlist = async () => {
        if (!user) {
            toast.error('Please login to add items to wishlist');
            return;
        }

        setLoading(true);
        try {
            const endpoint = inWishlist ? '/api/wishlist/remove' : '/api/wishlist/add';
            const { data } = await axios.post(endpoint, { productId });

            if (data.success) {
                setInWishlist(!inWishlist);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating wishlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            disabled={loading}
            className={`${className} ${inWishlist ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors disabled:opacity-50`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <svg
                className="w-6 h-6"
                fill={inWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    );
};

export default WishlistButton;

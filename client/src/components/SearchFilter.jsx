import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const SearchFilter = ({ onFilterChange, categories = [] }) => {
    const { searchQuery, setSearchQuery } = useAppContext();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: 'all',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    useEffect(() => {
        onFilterChange({ ...filters, search: searchQuery });
    }, [filters, searchQuery]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: 'all',
            minPrice: '',
            maxPrice: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setSearchQuery('');
    };

    const hasActiveFilters = filters.category !== 'all' || 
                           filters.minPrice || 
                           filters.maxPrice || 
                           filters.sortBy !== 'createdAt' || 
                           filters.sortOrder !== 'desc' ||
                           searchQuery;

    return (
        <div className="mb-6">
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <img
                        src={assets.search_icon}
                        alt="search"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    />
                </div>
                
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    Filters
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Min Price</label>
                            <input
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                placeholder="Min price"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Max Price</label>
                            <input
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                placeholder="Max price"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Sort Options */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="createdAt">Newest First</option>
                                <option value="name">Name A-Z</option>
                                <option value="offerPrice">Price Low to High</option>
                                <option value="averageRating">Highest Rated</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
                            <div className="flex flex-wrap gap-2">
                                {filters.category !== 'all' && (
                                    <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                                        Category: {filters.category}
                                    </span>
                                )}
                                {filters.minPrice && (
                                    <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                                        Min: ${filters.minPrice}
                                    </span>
                                )}
                                {filters.maxPrice && (
                                    <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                                        Max: ${filters.maxPrice}
                                    </span>
                                )}
                                {searchQuery && (
                                    <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                                        Search: "{searchQuery}"
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchFilter;

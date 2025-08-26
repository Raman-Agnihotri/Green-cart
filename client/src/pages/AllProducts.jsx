import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import SearchFilter from '../components/SearchFilter'

const AllProducts = () => {

    const {products, searchQuery, axios } = useAppContext()
    const [filteredProducts, setFilteredProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        fetchProducts()
    },[])

    const fetchProducts = async (filters = {}) => {
        setLoading(true)
        try {
            const queryParams = new URLSearchParams()
            if (filters.search) queryParams.append('search', filters.search)
            if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category)
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice)
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice)
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
            if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

            const { data } = await axios.get(`/api/product/list?${queryParams}`)
            if (data.success) {
                setFilteredProducts(data.products)
                setCategories(data.categories || [])
            }
        } catch (error) {
            console.log('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (filters) => {
        fetchProducts(filters)
    }

  return (
    <div className='mt-16 flex flex-col'>
      <div className='flex flex-col items-end w-max mb-6'>
        <p className='text-2xl font-medium uppercase'>All products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      <SearchFilter onFilterChange={handleFilterChange} categories={categories} />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-semibold mb-2">No products found</p>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5'>
              {filteredProducts.filter((product)=> product.inStock).map((product, index)=>(
                <ProductCard key={index} product={product}/>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AllProducts

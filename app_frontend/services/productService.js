// services/productService.js

// API Base URL - replace with your actual API URL
const API_BASE_URL = 'http://127.0.0.1:3344/api/product/all';

/**
 * Product API service for interacting with the backend
 */
export const ProductService = {
  /**
   * Get all products
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Number of products per page
   * @param {string} options.category - Filter by category
   * @param {boolean} options.isNewRelease - Filter by new release status
   * @param {boolean} options.isTrending - Filter by trending status
   * @returns {Promise<Object>} - Products response
   */
  async getAllProducts(options = {}) {
    // Build query string from options
    const queryParams = new URLSearchParams();
    if (options.page) queryParams.append('page', options.page);
    if (options.limit) queryParams.append('limit', options.limit);
    if (options.category) queryParams.append('category', options.category);
    if (options.isNewRelease !== undefined) queryParams.append('is_new_release', options.isNewRelease);
    if (options.isTrending !== undefined) queryParams.append('is_trending', options.isTrending);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    // try {
    //   const response = await fetch(`${API_BASE_URL}/products/${queryString}`, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       // Include auth token if needed
    //       ...(localStorage.getItem('jwt_access') && {
    //         'Authorization': `Bearer ${localStorage.getItem('jwt_access')}`
    //       })
    //     }
    //   });

    //   if (!response.ok) {
    //     throw new Error(`Error fetching products: ${response.status}`);
    //   }

    //   return await response.json();
    // } catch (error) {
    //   console.error('Failed to fetch products:', error);
    //   throw error;
    // }
  },

  /**
   * Get a single product by ID
   * @param {string} productId - The product ID
   * @returns {Promise<Object>} - Product data
   */
  async getProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include auth token if needed
          ...(localStorage.getItem('jwt_access') && {
            'Authorization': `Bearer ${localStorage.getItem('jwt_access')}`
          })
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new product (admin only)
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} - Created product
   */
  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_access')}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`Error creating product: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  /**
   * Update an existing product (admin only)
   * @param {string} productId - The product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} - Updated product
   */
  async updateProduct(productId, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/`, {
        method: 'PATCH', // Or PUT depending on your API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_access')}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`Error updating product: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to update product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a product (admin only)
   * @param {string} productId - The product ID
   * @returns {Promise<void>}
   */
  async deleteProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_access')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error deleting product: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Failed to delete product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Get products filtered by category
   * @param {string} category - Category name
   * @returns {Promise<Object>} - Products in the category
   */
  async getProductsByCategory(category) {
    return this.getAllProducts({ category });
  },

  /**
   * Get new release products
   * @param {number} limit - Number of products to return
   * @returns {Promise<Object>} - New release products
   */
  async getNewReleases(limit = 10) {
    return this.getAllProducts({ isNewRelease: true, limit });
  },

  /**
   * Get trending products
   * @param {number} limit - Number of products to return
   * @returns {Promise<Object>} - Trending products
   */
  async getTrendingProducts(limit = 10) {
    return this.getAllProducts({ isTrending: true, limit });
  }
};

export default ProductService;
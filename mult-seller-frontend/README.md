# Multi-Seller Frontend

A React-based e-commerce platform that allows users to browse multiple stores, view products, manage cart, and place orders.

## Features

### 🔐 Authentication
- **Sign Up**: Create new user accounts with full name, email, phone, and address
- **Login**: Secure user authentication
- **Guest Mode**: Browse and shop without creating an account

### 🏠 Homepage
- **Categories**: Browse products by category (Electronics, Fashion, Home & Garden, etc.)
- **Featured Stores**: View all available stores with ratings and verification status
- **Store Navigation**: Click on any store to view its products and details

### 🏪 Store Pages
- **Store Information**: View store banner, logo, description, and ratings
- **Product Catalog**: Browse all products from a specific store
- **Product Details**: View product images, descriptions, prices, and ratings
- **Add to Cart**: Add products to shopping cart with quantity selection
- **Store Reviews**: Read and write reviews for stores
- **Product Reviews**: Read and write reviews for individual products

### 🛒 Cart & Checkout
- **Shopping Cart**: View all selected products organized by store
- **Quantity Management**: Increase/decrease product quantities
- **Remove Items**: Remove products from cart
- **Checkout Form**: Complete order with:
  - Full Name
  - Email Address
  - Phone Number
  - Current Location
  - Preferred Delivery Time
- **Order Confirmation**: Receive order confirmation with estimated delivery

### ⭐ Reviews & Ratings
- **Store Ratings**: Rate stores from 1-5 stars
- **Product Ratings**: Rate individual products
- **Public Reviews**: All reviews are visible to other users
- **User Authentication**: Must be logged in to submit reviews

## Technology Stack

- **React**: Frontend framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **React Bits**: UI component library
- **Context API**: State management for authentication and cart

## Project Structure

```
src/
├── api/
│   └── services.js          # Placeholder API functions
├── components/
│   ├── Header.js           # Reusable header component
│   ├── LoadingSpinner.js   # Loading spinner component
│   └── StarRating.js       # Star rating component
├── context/
│   ├── AuthContext.js      # Authentication state management
│   └── CartContext.js      # Shopping cart state management
├── pages/
│   ├── auth/
│   │   ├── Login.js        # Login page
│   │   └── Signup.js       # Signup page
│   ├── cart/
│   │   └── CartPage.js     # Cart and checkout page
│   ├── home/
│   │   └── Homepage.js     # Main homepage
│   └── store/
│       └── StorePage.js    # Individual store page
├── App.js                  # Main app component with routing
└── index.js               # App entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mult-seller-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## API Integration

The project includes placeholder API functions in `src/api/services.js`. These functions simulate API calls with mock data and can be easily replaced with actual Laravel backend endpoints:

### Available API Functions

- `getCategories()` - Fetch all product categories
- `getStores()` - Fetch all stores
- `getStore(storeId)` - Fetch specific store details
- `getProducts(storeId)` - Fetch products for a specific store
- `getProduct(productId)` - Fetch specific product details
- `getStoreReviews(storeId)` - Fetch reviews for a store
- `getProductReviews(productId)` - Fetch reviews for a product
- `submitStoreReview(storeId, reviewData)` - Submit a store review
- `submitProductReview(productId, reviewData)` - Submit a product review
- `submitOrder(orderData)` - Submit an order

### Backend Integration

To connect with your Laravel backend:

1. Replace the mock data in `services.js` with actual API calls
2. Update the API endpoints to match your Laravel routes
3. Add proper error handling and authentication headers
4. Implement real user authentication flow

Example API call:
```javascript
export const getStores = async () => {
  try {
    const response = await fetch('/api/stores', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

## Features Implementation

### Authentication Flow
- Users can sign up with detailed information
- Login/logout functionality with persistent sessions
- Guest users can browse but need to login for reviews and checkout

### Shopping Cart
- Add/remove products with quantity management
- Cart persists across browser sessions
- Items are organized by store for better UX

### Reviews System
- Star-based rating system (1-5 stars)
- Text reviews with user information
- Separate reviews for stores and products
- Authentication required for submitting reviews

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive grid layouts
- Touch-friendly interface elements

## Future Enhancements

- User profile management
- Order history and tracking
- Wishlist functionality
- Advanced search and filtering
- Payment integration
- Real-time notifications
- Multi-language support
- Dark mode theme

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
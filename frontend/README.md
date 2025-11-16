# E-Commerce Frontend

A modern React + Tailwind CSS frontend application for the e-commerce platform.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Product Browsing**: View all products with search and category filtering
- **Product Details**: Detailed product pages with add to cart functionality
- **Shopping Cart**: Add, remove, and manage cart items
- **Order Management**: Place orders and track order status
- **Admin Panel**: Create, update, and delete products (admin functionality)

## Technologies

- React 19
- React Router DOM
- Tailwind CSS
- Axios
- Vite

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin components
│   ├── auth/           # Authentication components
│   ├── cart/           # Shopping cart components
│   ├── orders/         # Order components
│   ├── products/       # Product components
│   └── shared/         # Shared components (Header, Footer, etc.)
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service layer
└── utils/              # Utility functions
```

## API Integration

The frontend connects to the backend API at the URL specified in `VITE_API_URL`. Make sure your backend is running and CORS is enabled.

### Available Routes

- `/` - Home page with product listing
- `/login` - User login
- `/register` - User registration
- `/products/:id` - Product details
- `/cart` - Shopping cart (protected)
- `/orders` - Order history (protected)
- `/orders/:orderId` - Order details (protected)
- `/admin/products` - Admin product management (protected)
- `/admin/products/new` - Create new product (protected)
- `/admin/products/:id/edit` - Edit product (protected)

## Notes

1. **Backend API**: Make sure your backend server is running and CORS is configured to allow requests from `http://localhost:5173`

2. **Orders List**: The backend doesn't have a `getAllOrders` endpoint. Orders are tracked in the frontend state when created. You may want to add this endpoint to your backend.

3. **Cart Products**: The cart response doesn't populate product details. The frontend handles this by accessing the product data structure.

4. **Authentication**: JWT tokens are stored in localStorage. Make sure to handle token expiration appropriately.

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT

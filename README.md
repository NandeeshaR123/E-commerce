# E-commerce Backend

This is a Node.js backend application for an e-commerce platform. It utilizes MongoDB as the database and includes various features such as user authentication, product management, cart functionality, and order processing.

## Features

- **User Module**: 
  - Registration and login functionality using JWT for secure authentication.
  
- **Product Module**: 
  - Admin can perform CRUD operations on products.
  
- **Cart Module**: 
  - Users can manage their shopping cart, including adding and removing items.
  
- **Order Module**: 
  - Users can place orders and track their order status.
  
- **Image Upload**: 
  - Supports image uploads for products using Multer.

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT)
- Multer for file uploads

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd ecommerce-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up your MongoDB database and update the connection string in `src/config/db.js`.

5. Start the application:
   ```
   npm start
   ```

## API Endpoints

- **User Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login an existing user

- **Product Management**
  - `POST /api/products` - Create a new product (Admin only)
  - `GET /api/products` - Retrieve all products
  - `PUT /api/products/:id` - Update a product (Admin only)
  - `DELETE /api/products/:id` - Delete a product (Admin only)

- **Cart Management**
  - `POST /api/cart` - Add item to cart
  - `GET /api/cart` - Retrieve user's cart
  - `DELETE /api/cart/:id` - Remove item from cart

- **Order Management**
  - `POST /api/orders` - Place a new order
  - `GET /api/orders/:id` - Get order status

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
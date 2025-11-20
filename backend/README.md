# E-commerce Backend

This is a Node.js backend application for an e-commerce platform. It utilizes MongoDB as the database and includes various features such as user authentication, product management, cart functionality, and order processing.

## Features

- **User Module**: 
  - Registration and login functionality using JWT for secure authentication.
  - Role-based access control (Admin and User roles).
  - New users are created with 'user' role by default.
  
- **Product Module**: 
  - Admin can perform CRUD operations on products.
  - Regular users can view products only.
  
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

4. Set up your MongoDB database and create a `.env` file with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. Create an admin user (optional, but recommended for first-time setup):
   ```bash
   npm run create-admin
   ```
   
   Or with custom credentials:
   ```bash
   npm run create-admin username email@example.com password
   ```
   
   Example:
   ```bash
   npm run create-admin admin admin@example.com admin123
   ```

6. Start the application:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

## User Roles

The application supports two user roles:

- **User** (default): Can browse products, manage cart, and place orders.
- **Admin**: Can perform all user actions plus manage products (create, update, delete).

### Creating Admin Users

To create an admin user, use the provided script:

```bash
npm run create-admin
```

This will create an admin user with default credentials:
- Username: `admin`
- Email: `admin@example.com`
- Password: `admin123`

To create an admin with custom credentials:

```bash
npm run create-admin <username> <email> <password>
```

Example:
```bash
npm run create-admin myadmin admin@mydomain.com securepassword123
```

**Note:** If a user with the same email or username already exists, the script will either:
- Inform you if they're already an admin, or
- Promote the existing user to admin role (and update their password)

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
  - `POST /api/orders` - Place a new order (Authenticated users only)
  - `GET /api/orders/:id` - Get order status (Authenticated users only)

## Authentication & Authorization

- All protected routes require a valid JWT token in the `Authorization` header:
  ```
  Authorization: Bearer <token>
  ```

- Admin-only routes require both authentication and admin role. The JWT token includes the user's role, which is verified by the `adminMiddleware`.

- If a user's role is changed in the database, they must log out and log back in for the change to take effect (since the role is stored in the JWT token).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
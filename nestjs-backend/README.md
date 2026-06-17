# E-commerce Backend API Documentation

A production-ready NestJS e-commerce backend built with MongoDB (Mongoose) and secure HTTP-Only Cookie JWT Authentication.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas cluster or local database URI

### 2. Configuration
Create a `.env` file at the root of the project:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
```

### 3. Installation
```bash
npm install
```

### 4. Running the Application
```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 5. Interactive Swagger Documentation
Once the server is running, visit:
**`http://localhost:3000/api`** for the interactive Swagger UI.

---

## Authentication Flow (Cookies)
This application uses **HTTP-Only Cookies** for session storage.
1. **Login:** Call `POST /auth/login`. On successful authentication, the server sets a cookie named `access_token` containing the JWT.
2. **Accessing Protected Routes:** The browser or client automatically includes this cookie in subsequent requests. You do not need to manually configure Authorization Bearer headers.
3. **Logout:** Call `POST /auth/logout` to clear the `access_token` cookie from the client.

---

## API Reference

### 1. Authentication

#### Register User
Creates a new customer profile.
* **Method:** `POST`
* **Path:** `/auth/register`
* **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secretpassword123"
}
```
* **Success Response (201):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "_id": "60c72b2f9b1d8e2568e61234",
  "createdAt": "2026-06-16T09:00:00.000Z",
  "updatedAt": "2026-06-16T09:00:00.000Z"
}
```

#### Login User
Authenticates the user and sets the HTTP-Only `access_token` cookie.
* **Method:** `POST`
* **Path:** `/auth/login`
* **Body:**
```json
{
  "email": "john@example.com",
  "password": "secretpassword123"
}
```
* **Success Response (200):**
```json
{
  "message": "Successfully logged in",
  "user": {
    "id": "60c72b2f9b1d8e2568e61234",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Logout User
Clears the `access_token` cookie.
* **Method:** `POST`
* **Path:** `/auth/logout`
* **Body:** None
* **Success Response (200):**
```json
{
  "message": "Successfully logged out"
}
```

---

### 2. Products

#### Create Product
Adds a new product (useful for admin or catalog seeding).
* **Method:** `POST`
* **Path:** `/products`
* **Body:**
```json
{
  "name": "Mechanical Keyboard",
  "description": "RGB backlit mechanical keyboard with blue switches.",
  "price": 79.99,
  "stock": 100,
  "imageUrl": "https://example.com/keyboard.jpg",
  "category": "Electronics"
}
```
* **Success Response (201):** Product document with generated `_id`.

#### Get All Products
Retrieves a list of all products in reverse chronological order.
* **Method:** `GET`
* **Path:** `/products`
* **Body:** None
* **Success Response (200):** Array of product documents.

#### Get Product By ID
Retrieves details for a single product.
* **Method:** `GET`
* **Path:** `/products/:id`
* **Body:** None
* **Success Response (200):** Product document.

#### Update Product
Updates specific fields of an existing product.
* **Method:** `PUT`
* **Path:** `/products/:id`
* **Body:**
```json
{
  "price": 89.99,
  "stock": 95
}
```
* **Success Response (200):** Updated product document.

#### Delete Product
Removes a product from the database.
* **Method:** `DELETE`
* **Path:** `/products/:id`
* **Body:** None
* **Success Response (200):** Deleted product document.

---

### 3. Shopping Cart (Protected - Authentication Cookie Required)

#### Add Product to Cart
Adds a product to the cart. If the product already exists in the cart, the quantity is incremented by the specified amount. Validates stock availability.
* **Method:** `POST`
* **Path:** `/cart`
* **Body:**
```json
{
  "productId": "60c72b2f9b1d8e2568e65678",
  "quantity": 2
}
```
* **Success Response (201):** Cart item document.

#### View Cart
Fetches the user's active cart items with detailed populated product details and auto-calculated cart sub-totals and grand total.
* **Method:** `GET`
* **Path:** `/cart`
* **Body:** None
* **Success Response (200):**
```json
{
  "items": [
    {
      "id": "60c72b2f9b1d8e2568e61111",
      "productId": "60c72b2f9b1d8e2568e65678",
      "name": "Mechanical Keyboard",
      "price": 79.99,
      "imageUrl": "https://example.com/keyboard.jpg",
      "quantity": 2,
      "stock": 98,
      "subTotal": 159.98
    }
  ],
  "totalPrice": 159.98
}
```

#### Update Cart Item Quantity
Directly changes the quantity of a specific item in the cart. Validates stock availability.
* **Method:** `PUT`
* **Path:** `/cart/:productId`
* **Body:**
```json
{
  "quantity": 5
}
```
* **Success Response (200):** Updated cart item document.

#### Remove Item from Cart
Deletes a specific product item from the user's cart.
* **Method:** `DELETE`
* **Path:** `/cart/:productId`
* **Body:** None
* **Success Response (204):** No Content.

#### Clear Cart
Removes all items from the user's cart.
* **Method:** `DELETE`
* **Path:** `/cart`
* **Body:** None
* **Success Response (204):** No Content.

---

### 4. Orders (Protected - Authentication Cookie Required)

#### Place Order
Creates an order based on current cart items, checks stock availability, decrements stock levels, clears the cart, and sets order status to `Pending`.
* **Method:** `POST`
* **Path:** `/orders`
* **Body:**
```json
{
  "paymentMethod": "COD"
}
```
* **Success Response (201):**
```json
{
  "_id": "60c72b2f9b1d8e2568e69999",
  "userId": "60c72b2f9b1d8e2568e61234",
  "products": [
    {
      "productId": "60c72b2f9b1d8e2568e65678",
      "name": "Mechanical Keyboard",
      "price": 79.99,
      "quantity": 2,
      "_id": "60c72b2f9b1d8e2568e6999a"
    }
  ],
  "totalAmount": 159.98,
  "paymentMethod": "COD",
  "status": "Pending",
  "createdAt": "2026-06-16T09:30:00.000Z",
  "updatedAt": "2026-06-16T09:30:00.000Z",
  "__v": 0
}
```

#### View My Orders
Lists all orders placed by the currently logged-in user in reverse chronological order.
* **Method:** `GET`
* **Path:** `/orders`
* **Body:** None
* **Success Response (200):** Array of order documents.

#### View Single Order By ID
Retrieves details for a single order by ID. Checks ownership of the order.
* **Method:** `GET`
* **Path:** `/orders/:id`
* **Body:** None
* **Success Response (200):** Order document.

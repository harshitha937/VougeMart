<<<<<<< HEAD
# VougeMart
Mern Web app
=======


## 📄 **E-Commerce Website Project Report**


---

### 1. 📝 Introduction

This project is a full-stack e-commerce web application built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. The objective is to build a responsive, user-friendly online store that supports user registration, product browsing, cart management, order processing, and an admin dashboard for managing the system.

The application allows users to:

* Register/Login
* Browse products
* Add items to cart and place orders
* View and manage their orders

Admins can:

* Add/edit/delete products
* View all orders
* Mark orders as delivered

---

### 2. 📁 Project Structure

```
.
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
├── .env
├── package.json
└── README.md
```

* **backend/**: Handles API routes, business logic, database interaction.
* **frontend/**: React app for UI using Tailwind CSS and Ant Design.

---

### 3. 🧰 Technical Stack

* **Frontend:** React.js, Tailwind CSS, Ant Design
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JWT Token, Cookies
* **State Management:** React Context + LocalStorage
* **Payment (Test):** Dummy PayPal-like implementation
* **Version Control:** Git & GitHub
* **Deployment:** *\[Optional if deployed]*

---

### 4. 🌟 Features and Functionalities

#### 👤 User Features:

* Register, Login, Logout
* Browse Products by Category, Search, Price Filters
* View product details
* Add to Cart (localStorage-based)
* Checkout and place orders
* Mark their orders as paid
* View order history

#### 🛠 Admin Features:

* Admin login
* Add/edit/delete products
* Manage product categories
* View all orders
* Mark orders as delivered

#### 🧾 Order System:

* Orders include user, cart items, total price, payment & delivery status

---

### 6. 🖼️ Screenshots and Visuals

### Home Page
![Home page](./screenshots/Home.png)

### Home after Login
![Home page](./screenshots/Homelogin.png)

### Login Page
![Login page](./screenshots/Login.png)

### Register Page
![Register page](./screenshots/Register.png)

### Logout Page
![Logout page](./screenshots/Logout.png)

### Product Page
![Product page](./screenshots/Product.png)

### Product Details Page
![ Product Details page](./screenshots/ProductDetails.png)

###  Added to favourites Page
![Added to favourites  page](./screenshots/AddedtoFav.png)

###  Search Bar
![search Bar page](./screenshots/SearchBar.png)

### All categories Page
![All categories page](./screenshots/Add_category.png)

### Category select Page
![Category Select page](./screenshots/categoryselect.png)

### Favourite  Page
![Favourite page](./screenshots/Favoruites.png)

### Cart Page
![Cart page](./screenshots/Cart.png)

### Shipping Page
![Shipping page](./screenshots/Shipping.png)

### Paypal page
![Paypal page](./screenshots/PayPAl.png)


### User Orders page
![My orders page](./screenshots/Myorders.png)


### MArk order as paid 
![Mark order as paid](./screenshots/OrserPaid.png)
---
Admin Panel
---
### Admin DashBoard page
![Admin Dashboard page](./screenshots/AdminDashboard.png)


### Manage Products page
![Manage products page](./screenshots/ManagePRoducts.png)


### ADD PRoduct 
![Add Product page](./screenshots/CreateProduct.png)


### Add PRoduct Button 
![Product Button](./screenshots/AddProductButton.png)


### Paypal page
![Paypal page](./screenshots/PayPAl.png)


### Manage categories page
![Manage categories page](./screenshots/ManageCategory.png)


### Add Cateory page
![Add Category page](./screenshots/Add_category.png)

### Edit Cateory page
![Edit Category page](./screenshots/Edit%20Category.png)

### Manage users page
![Add Category page](./screenshots/ManageUSers.png)

### Admin profile page
![Admin profile page](./screenshots/AdminProfile.png)









---

### 7. 🗃 Database Structure

#### 🔹 User Model:

```js
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (user/admin)
}
```

#### 🔹 Product Model:

```js
{
  name: String,
  description: String,
  price: Number,
  category: ObjectId,
  image: String
}
```

#### 🔹 Order Model:

```js
{
  user: ObjectId,
  orderItems: [ { product, quantity } ],
  totalPrice: Number,
  isPaid: Boolean,
  isDelivered: Boolean,
  paymentResult: Object
}
```

#### 🔹 Category Model:

```js
{
  name: String
}

---

### 8. 🚧 Challenges Faced

* Setting up secure authentication with JWT and cookies
* Managing separate user and admin flows
* Maintaining synchronization between localStorage cart and backend
* Creating reusable Ant Design components with Tailwind layout
* Handling role-based access in protected routes

---

### 9. ✅ Conclusion

This project demonstrates a fully functional e-commerce system using the MERN stack. Through this experience, I deepened my understanding of full-stack development, authentication flows, and component-driven UI design. The project also helped in learning how to structure large applications and handle real-world problems like routing, protected pages, and database schema design.

---

>>>>>>> 136545d (First Commit)

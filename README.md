# CherishIndia E-Store

A complete full-stack e-commerce web application built with React.js frontend and Node.js backend, featuring sustainable product shopping with a focus on eco-friendly items.

## 🌟 Features

### Core Features
- **User Authentication**: Secure JWT-based login and registration
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items with localStorage persistence
- **Product Details**: Detailed product pages with images and descriptions
- **Checkout Process**: Complete order flow with payment simulation
- **Admin Dashboard**: Full CRUD operations for product management

### Bonus Features
- **Search & Filters**: Real-time product search and category filtering
- **Dark Mode**: Theme toggle with Context API
- **Animations**: Smooth Framer Motion animations
- **Toast Notifications**: React-Toastify for user feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Eco-Impact Tracking**: Highlight eco-friendly products

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Toastify** - Notification system

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cherishindia-ecommerce.git
   cd cherishindia-ecommerce
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📁 Project Structure

```
cherishindia-ecommerce/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

## 🎨 UI/UX Design

- **Theme**: Sustainable green-orange-white color scheme
- **Typography**: Poppins and Inter fonts
- **Layout**: Responsive grid system
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant design

## 🌱 Brand Mission

**"Self Goodness : Better World"**

CherishIndia is committed to promoting sustainable living through conscious consumption. Every purchase contributes to environmental conservation and supports eco-friendly businesses.

## 📱 Features Overview

### User Experience
- Intuitive navigation and search
- Seamless shopping experience
- Secure authentication flow
- Persistent shopping cart
- Mobile-optimized interface

### Admin Features
- Product management dashboard
- Real-time inventory updates
- Image upload functionality
- User management capabilities

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

### Backend Deployment (Render)
1. Connect GitHub repository
2. Set build and start commands
3. Configure environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Set up database user
3. Whitelist IP addresses
4. Get connection string

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from sustainable e-commerce platforms
- Icons from Lucide React
- UI components from shadcn/ui
- Animation library from Framer Motion

## 📞 Contact

- **Project**: CherishIndia E-Store
- **Email**: info@cherishindia.com
- **GitHub**: [yourusername](https://github.com/yourusername)

---

**Made with ❤️ for a sustainable future**
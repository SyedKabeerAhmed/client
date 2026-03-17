# Hair Store E-commerce Application

A modern, responsive React e-commerce application for hair systems with complete authentication system.

## 🚀 Features

- **Authentication System**: Complete login, signup, forgot password, and OTP verification
- **Responsive Design**: Pixel-perfect, mobile-first design with Bootstrap
- **Component Architecture**: Reusable, modular components
- **API Integration**: Full backend integration with Express.js
- **State Management**: React Context for authentication state
- **Form Validation**: Client and server-side validation

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Bootstrap 5, React Router DOM
- **Backend**: Express.js, Node.js
- **Authentication**: JWT tokens
- **Styling**: CSS3, Flexbox, Responsive Design

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API service layer
├── contexts/           # React contexts
├── config/             # Configuration files
├── assets/             # Static assets
└── styles/             # Global styles
```

## ⚙️ Environment Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CALENDLY_EVENT_URL=https://calendly.com/your-username/your-event
```

### 2. Backend Configuration

Make sure your backend is running on `localhost:5000` with the following endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`

### 3. CORS Configuration

Ensure your backend has CORS enabled for your frontend URL (usually `http://localhost:3000` or `http://localhost:5173`).

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on localhost:5000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API base URL
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start your backend server**
   ```bash
   # In your backend directory
   npm start
   ```

## 📱 Pages

- **Home** (`/`) - Landing page with product showcase
- **About** (`/about`) - Company information
- **Help** (`/help`) - FAQ and support
- **Beginners Guide** (`/beginners-guide`) - Getting started guide
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration
- **Forgot Password** (`/forgot-password`) - Password recovery
- **OTP Verification** (`/otp-verification`) - OTP verification
- **Reset Password** (`/reset-password`) - Password reset

## 🔧 Configuration

### API Configuration

The API configuration is managed in `src/config/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      // ... other endpoints
    }
  }
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |
| `VITE_CALENDLY_EVENT_URL` | Calendly event URL for appointment booking | `https://calendly.com/your-username/your-event` |

## 🎨 Styling

- **Bootstrap 5**: For responsive grid and components
- **Custom CSS**: Pixel-perfect styling with Flexbox
- **Responsive Design**: Mobile-first approach
- **Component Styles**: Scoped CSS for each component

### CSS Class Naming

- Prefer `component-or-page-name__element` style classes (e.g. `product-section-title`, `cart-customization-title`) to avoid collisions across sections.
- Keep truly global utilities (e.g. `.text-primary`, `.bg-primary`) inside `src/index.css` only.
- When you must reuse a structural class, scope it with the parent container selector inside the CSS file rather than relying on a bare class name.

## 🔐 Authentication Flow

1. **Registration**: User creates account with email verification
2. **Login**: JWT token-based authentication
3. **Password Recovery**: OTP-based password reset
4. **State Management**: Global authentication context
5. **Token Storage**: Secure localStorage management

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

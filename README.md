# Matcha - Sencha

A modern React-based e-commerce frontend for the Matcha tea store.

## Recent Updates

### Professional Admin Dashboard
The admin dashboard has been enhanced with comprehensive analytics and professional charts:

#### 📊 Key Features
- **Real-time Statistics**: Revenue, orders, products, and user metrics with growth indicators
- **Interactive Charts**: Built with Recharts library for smooth, responsive visualizations
- **Data Integration**: Seamlessly connected to Product, Order, Discount, and Account hooks
- **Professional UI**: Material-UI components with hover animations and gradient styling

#### 📈 Dashboard Sections

1. **Key Metrics Cards**
   - Total Revenue with growth percentage
   - Total Orders with trend indicators  
   - Product count and active users
   - Average order value calculation

2. **Revenue & Orders Trend** 
   - 12-month area chart showing revenue progression
   - Dual-axis visualization for revenue and order volume
   - Gradient fills and smooth animations

3. **Order Status Distribution**
   - Pie chart showing completed, pending, processing, and cancelled orders
   - Color-coded status indicators
   - Real-time data from order management system

4. **Best Selling Products**
   - Horizontal bar chart of top 8 products by sales volume
   - Product performance comparison
   - Revenue metrics per product

5. **Discount Usage Analytics**
   - Line chart showing customer savings trends
   - 6-month discount utilization data
   - Usage frequency and impact analysis

6. **Recent Activity Feed**
   - Real-time system updates
   - Order notifications and user registrations
   - Product inventory changes
   - Discount code usage alerts

7. **Quick Actions Panel**
   - One-click access to common admin tasks
   - Product management shortcuts
   - User and order management links
   - Average order value display

#### 🎨 Technical Implementation
- **Hooks Integration**: Leverages existing Product, Order, Discount, and Account hooks
- **State Management**: Efficient loading states and error handling
- **Responsive Design**: Mobile-friendly charts and layouts
- **Performance**: Optimized data fetching and chart rendering
- **Type Safety**: Full TypeScript support with proper interfaces

#### 🔧 Dependencies Used
- `recharts`: Professional chart library for React
- `@mui/material`: Material-UI components and theming
- `lucide-react`: Modern icon library
- Custom hooks for data management

#### 📱 Responsive Features
- Mobile-optimized chart containers
- Adaptive grid layouts
- Touch-friendly interactions
- Scalable typography and spacing

The dashboard provides administrators with comprehensive insights into business performance, customer behavior, and operational metrics through beautiful, interactive visualizations.

# Sencha

![image](https://github.com/user-attachments/assets/8722024c-1666-4002-bc30-19304e134fee)


---

## Overview

**Sencha** is a modern, responsive web application built with **React**, styled beautifully using **Tailwind CSS**, and powered by **Appwrite** for its backend services. This project demonstrates a fantastic combination of cutting-edge frontend development with a robust, self-hosted (or cloud-based) backend-as-a-service.

Sencha is designed to be your go-to platform for **connecting with a vibrant community of tea enthusiasts, sharing delightful recipes, and exploring the world of tea.** Whether you're looking to discover new blends, share your favorite brewing methods, or engage in discussions about tea culture, Sencha provides a seamless and intuitive user experience.

---

## Features

* **User Authentication & Management:** Secure sign-up, login, and user profile management powered by Appwrite.
* **Recipe Creation & Sharing:** Effortlessly create and share your favorite tea-infused recipes with rich text editing.
* **Dynamic Search & Filtering:** Easily find recipes based on ingredients, tea types, or cuisine with powerful search and filtering options.
* **Personalized Dashboards:** Track your saved recipes, favorite blends, and community interactions from a personalized user dashboard.
* **Responsive UI:** A stunning, mobile-first design thanks to Tailwind CSS, ensuring a great experience on any device.
* **Fast & Efficient:** Optimized performance through React's virtual DOM and Tailwind's utility-first approach.

---

## Technologies Used

* **Frontend:**
    * **React:** A declarative, component-based JavaScript library for building user interfaces.
    * **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
* **Backend:**
    * **Appwrite:** An open-source, end-to-end backend server for web, mobile, and flutter developers. It handles:
        * Authentication
        * Databases
        * Storage
        * Functions (Serverless)
        * Realtime

---

## Getting Started

Follow these steps to get your development environment up and running.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (LTS version recommended)
* **npm** or **Yarn**

### Appwrite Setup

1.  **Install Appwrite:**
    * **Self-hosted:** Follow the [official Appwrite installation guide](https://appwrite.io/docs/installation) to set up Appwrite on your server (e.g., Docker).
    * **Appwrite Cloud:** Alternatively, sign up for a free account at [cloud.appwrite.io](https://cloud.appwrite.io/).
2.  **Create a New Project:** Once Appwrite is installed/accessible, create a new project. Make sure to note down your **Project ID**.
3.  **Set up Collections/Buckets:** In your Appwrite console, create the necessary **databases, collections, and storage buckets** for Sencha. You'll likely need:
    * `users` collection
    * `recipes` collection
    * `comments` collection
    * `recipe-images` storage bucket
    Define appropriate **read/write permissions** for each to ensure data security and proper access.
4.  **Environment Variables:** Create a `.env` file in the root of your project and add your Appwrite credentials:

    ```dotenv
    VITE_APPWRITE_PROJECT_ID=YOUR_APPWRITE_PROJECT_ID
    VITE_APPWRITE_ENDPOINT=YOUR_APPWRITE_ENDPOINT # e.g., [https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1) or your self-hosted URL
    # Add any other Appwrite-related environment variables here (e.g., specific collection IDs if hardcoded)
    ```
5. **Run the setup script to create collections and indexes:**
    ```bash
    npm run setup:db
    # or
    yarn setup:db
    ```
    
6. **Seed initial discount data:**
    ```bash
    npm run seed:discounts
    # or
    yarn seed:discounts
    ```

### Local Development

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/sencha.git](https://github.com/your-username/sencha.git)
    cd sencha
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application will typically be available at `http://localhost:5173` (or another port as indicated in your terminal).

---

## Project Structure

### Layout Architecture

The project uses a clean, modular layout structure for better maintainability:

```
src/components/layout/
├── layouts/                    # Main layout containers
│   ├── AdminLayout.tsx         # Admin dashboard layout
│   ├── CustomerLayout.tsx      # Customer-facing layout
│   └── index.ts               # Layout exports
│
├── admin/                     # Admin-specific components
│   ├── AdminHeader.tsx        # Admin header with search, notifications
│   ├── AdminSidebar.tsx       # Collapsible admin sidebar
│   ├── AdminMainContent.tsx   # Main content area wrapper
│   └── index.ts              # Admin component exports
│
├── customer/                  # Customer-facing components
│   ├── CustomerHeader.tsx     # Customer header with navigation
│   ├── navigation/           # Navigation components
│   │   ├── DesktopNav.tsx    # Desktop navigation menu
│   │   ├── MobileNav.tsx     # Mobile navigation menu
│   │   ├── MobileMenuButton.tsx  # Mobile menu toggle
│   │   └── index.ts          # Navigation exports
│   ├── logo/                 # Logo components
│   │   ├── Logo.tsx          # Animated company logo
│   │   └── index.ts          # Logo exports
│   └── index.ts              # Customer component exports
│
├── shared/                   # Shared layout components
│   ├── Footer.tsx            # Application footer
│   └── index.ts              # Shared component exports
│
└── index.ts                  # Main layout exports
```

#### Key Features:

- **Modular Structure**: Components are organized by domain (admin, customer, shared)
- **Clean Imports**: Index files enable clean, short import statements
- **Separation of Concerns**: Admin and customer layouts are completely separate
- **Reusable Components**: Shared components for common elements
- **Type Safety**: All components are properly typed with TypeScript

#### Usage Examples:

```typescript
// Clean imports from the layout system
import { AdminLayout, CustomerLayout } from '../components/layout';
import { Logo, DesktopNav } from '../components/layout/customer';
import { Footer } from '../components/layout/shared';
```

### Tax Integration

The application integrates with **TaxJar** for accurate tax calculation during checkout. 

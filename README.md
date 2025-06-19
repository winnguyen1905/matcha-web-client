# Sencha

![image](https://github.com/user-attachments/assets/8722024c-1666-4002-bc30-19304e134fee)

![image](https://github.com/user-attachments/assets/3098e308-9268-4b14-a9ab-c6c14c52aabd)

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

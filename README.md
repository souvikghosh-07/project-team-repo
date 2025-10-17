# QuickServe - Local Service Finder & Booking Platform

QuickServe is a dynamic, full-stack web application designed to seamlessly connect local service providers with customers. Built with a modern tech stack (React, Node.js, Express, and MySQL), it provides a complete, role-based ecosystem for discovering, booking, and managing a wide variety of local services.

-----
<img width="1341" height="682" alt="image" src="https://github.com/user-attachments/assets/a1efb3ef-ba51-4e97-a0dc-d96c666e7eb0" />

-----

## ✨ Key Features

The platform is built around three distinct user roles, each with a tailored dashboard and a specific set of permissions.

### 👤 For Customers

  * **Intuitive Service Discovery:** Search and filter services by keywords, category, and location.
  * **Seamless Booking System:** View service availability and book appointments through an interactive calendar modal.
  * **Booking Management:** A personal dashboard to view and track the history of all booked services.
  * **Trustworthy Reviews:** Leave star ratings and comments on completed services to help the community.
  * **Personalized Experience:** A secure signup and login system that remembers user sessions.

### 🛠️ For Service Providers

  * **Easy Listing Management:** Create, manage, and delete detailed service listings complete with descriptions, pricing, and image uploads.
  * **Booking Oversight:** A dedicated dashboard tab to view all customer bookings for their services in a clean, organized table.
  * **Profile Management:** A secure system to manage their professional presence on the platform.

### 👑 For Admins

  * **Comprehensive Analytics Dashboard:** Get a high-level overview of the platform with key metrics, including total users, active providers, and total bookings.
  * **Data-Driven Insights:** View lists of the top-performing service categories and individual services to understand market trends.
  * **Content Moderation:** A dedicated approvals queue to review, approve, or reject new service listings submitted by providers, ensuring platform quality and safety.

-----

## 🛠️ Tech Stack & Architecture

This project is a full-stack application with a clear separation between the frontend client and the backend server.

  * **Frontend:**

      * **React:** For building a fast, interactive, and component-based user interface.
      * **React Router:** For seamless client-side navigation between pages.
      * **React Context API:** For robust global state management (e.g., user authentication).
      * **Axios:** For making asynchronous HTTP requests to the backend API.
      * **CSS:** Modern, clean styling with a dark-theme aesthetic.

  * **Backend:**

      * **Node.js & Express.js:** For building a fast, scalable, and secure RESTful API.
      * **MySQL:** As the relational database to store all user, listing, booking, and review data.
      * **Express Session:** For secure, cookie-based user session management.
      * **Bcrypt.js:** For industry-standard hashing and security of user passwords.
      * **Dotenv:** For managing environment variables and keeping secrets out of the codebase.
      * **Multer:** For handling image uploads and file data.

-----

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js (v14 or later)
  * npm
  * MySQL Server

### Installation & Setup

1.  **Clone the Repository**

    ```sh
    git clone https://github.com/Piyushkharapkar/QuickServe---Local-service-finder-and-booking-Platform.git
    cd QuickServe---Local-service-finder-and-booking-Platform
    ```

2.  **Setup the Backend**

      * Navigate to the backend directory:
        ```sh
        cd Backend
        ```
      * Install NPM packages:
        ```sh
        npm install
        ```
      * **Create the database:** In your MySQL client, create a new database named `local_service_db`.
      * **Create the tables:** Run the SQL queries found in the `schema.sql` file (or run them manually) to create the `users`, `listings`, `bookings`, and `reviews` tables.
      * **Create a `.env` file** in the `Backend` root. This is crucial for storing your database credentials and session secret. Copy the contents of `.env.example` or use the template below:
        ```env
        DB_HOST=localhost
        DB_USER=your_mysql_user
        DB_PASSWORD=your_mysql_password
        DB_DATABASE=local_service_db
        SESSION_SECRET=a_very_long_and_random_secret_string
        ```

3.  **Setup the Frontend**

      * Navigate to the frontend directory:
        ```sh
        cd ../Frontend
        ```
      * Install NPM packages:
        ```sh
        npm install
        ```

4.  **Run the Application**

      * **Start the backend server:** In your `Backend` terminal, run:
        ```sh
        npm start
        ```
        The server will be running on `http://localhost:3001`.
      * **Start the frontend client:** In your `Frontend` terminal, run:
        ```sh
        npm start
        ```
        The application will open in your browser at `http://localhost:3000`.

You are now ready to explore the QuickServe platform\! You can create customer, provider, and admin accounts to test the full range of features.

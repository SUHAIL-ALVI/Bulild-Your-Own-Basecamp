# Bulild Your Own Basecamp 🔐
 
This project is a robust authentication service designed to handle user registration, login, and secure access to protected resources. It provides a comprehensive solution for managing user identities, verifying credentials, and issuing JSON Web Tokens (JWTs) for secure authentication. The service also includes features for email verification, password reset, and user profile management, ensuring a secure and user-friendly experience.

## 🚀 Key Features

- **User Registration:** Allows new users to create accounts with email verification. 📧
- **Secure Login:** Authenticates users and generates access and refresh tokens. 🔑
- **JWT Authentication:** Uses JSON Web Tokens for secure access to protected routes. 🛡️
- **Email Verification:** Sends verification emails to new users to confirm their email addresses. ✅
- **Password Reset:** Enables users to reset their passwords if they forget them. 🔄
- **Refresh Token Rotation:** Implements refresh token rotation for enhanced security. ♻️
- **User Profile Management:** Provides endpoints for users to manage their profiles. 👤
- **CORS Support:** Configured to allow requests from specified origins. 🌐
- **Error Handling:** Centralized error handling using custom `ApiError` class. ⚠️
- **API Response Standardization:** Uses `ApiResponse` class for consistent API responses. 📦

## 🛠️ Tech Stack

- **Backend:**
    - Node.js ⚙️
    - Express.js 🚀
- **Database:**
    - MongoDB 🍃
    - Mongoose 📚
- **Authentication:**
    - JSON Web Tokens (JWT) 🔑
    - bcrypt (Password Hashing) 🔒
    - cookie-parser 🍪
- **Email:**
    - Nodemailer 📧 (configured separately - see `.env` setup)
- **Middleware:**
    - cors 🌐
    - express.json() ⚙️
    - express.urlencoded() ⚙️
    - express.static() ⚙️
- **Utilities:**
    - dotenv (Environment Variables) ⚙️
- **Other:**
    - crypto (for generating random tokens) 🔑

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher) installed on your machine.
- MongoDB installed and running or a MongoDB Atlas account.

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2.  Navigate to the project directory:

    ```bash
    cd <project-directory>
    ```

3.  Install the dependencies:

    ```bash
    npm install
    ```

4.  Create a `.env` file in the root directory and configure the following environment variables:

    ```env
    PORT=3000
    MONGODB_URI=<your_mongodb_connection_string>
    ACCESS_TOKEN_SECRET=<your_access_token_secret>
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    ACCESS_TOKEN_EXPIRY=1h
    REFRESH_TOKEN_EXPIRY=7d
    CORS_ORIGIN=<your_cors_origin> # e.g., http://localhost:5173
    SMTP_HOST=<your_smtp_host> # e.g., smtp.gmail.com
    SMTP_PORT=<your_smtp_port> # e.g., 587
    SMTP_USERNAME=<your_smtp_username> # e.g., your_email@gmail.com
    SMTP_PASSWORD=<your_smtp_password> # e.g., your_email_password or app password
    ```

    **Note:** Replace the placeholder values with your actual configuration. For SMTP configuration, ensure you have enabled "less secure app access" in your Gmail account or generated an app password.

### Running Locally

1.  Start the server:

    ```bash
    npm run dev
    ```

2.  The server will start running on the port specified in the `.env` file (default: 3000).

## 💻 Usage

Once the server is running, you can access the API endpoints using tools like Postman or curl. Here are some example endpoints:

-   **Register:** `POST /api/v1/auth/register`
-   **Login:** `POST /api/v1/auth/login`
-   **Logout:** `POST /api/v1/auth/logout`
-   **Current User:** `GET /api/v1/auth/current-user`

Refer to the API documentation (if available) for a complete list of endpoints and their usage.

## 📂 Project Structure

```
├── .env                  # Environment variables configuration
├── .gitignore            # Specifies intentionally untracked files that Git should ignore
├── package.json          # Project metadata and dependencies
├── README.md             # Project documentation
├── src
│   ├── app.js            # Express application configuration
│   ├── db
│   │   └── index.js      # Database connection setup
│   ├── index.js          # Entry point of the application
│   ├── middleware
│   │   ├── auth.middleware.js    # Authentication middleware
│   │   └── validator.middleware.js # Request body validation middleware
│   ├── models
│   │   └── user.models.js  # User model definition
│   ├── controllers
│   │   └── auth.controllers.js # Authentication controllers
│   ├── routes
│   │   ├── auth.routes.js    # Authentication routes
│   │   └── healthcheck.routes.js # Health check routes
│   ├── utils
│   │   ├── api-error.js    # Custom API error class
│   │   ├── api-response.js   # Custom API response class
│   │   ├── async-handler.js  # Asynchronous error handler
│   │   └── mail.js         # Email sending utility
│   └── validators
│       └── index.js        # Request body validators
```


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

[Suhail Alvi] - [alvisuhail400@gmail.com]

## 💖 Thanks 

Thank you for checking out this authentication service! We hope it helps you build secure and reliable applications.





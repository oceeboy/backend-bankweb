# Bank App Backend

This project is the backend service for a banking application. It is built using Node.js and MongoDB, and it provides various functionalities required for managing user accounts, transactions, and other banking operations.

## Features

- User account management
- Authentication and authorization
- Account balance management
- Currency handling
- Role-based access control
- KYC verification
- OTP for secure transactions

## User Schema

The user schema defines the structure of the user data stored in the database. Below are the key fields and their descriptions:

- **firstName**: The first name of the user (required).
- **lastName**: The last name of the user (required).
- **dateOfBirth**: The date of birth of the user (required).
- **address**: The address of the user, including street, city, state, and postal code (all required).
- **email**: The email address of the user (unique and required).
- **password**: The password for the user's account (required).
- **accountNumber**: The unique account number for the user (unique and required).
- **balance**: The current balance of the user's account (default is 0).
- **currency**: The currency code for the user's account (default is DEM).
- **role**: The role of the user (default is User).
- **isFrozen**: A flag indicating if the account is frozen (default is false).
- **otp**: The one-time password for secure transactions (optional).
- **accountStatus**: The status of the account (default is ACTIVE).
- **kycVerified**: A flag indicating if the user has completed KYC verification (default is false).

## Installation

To install the project dependencies, run:

```bash
npm install
```

## Running the Application

To start the application, run:

```bash
npm start
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.

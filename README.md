# Ingredience

Ingredience is a kitchen management app designed to help users keep track of their kitchen inventory, generate recipes, and manage shopping lists. The app includes features for managing ingredients, expiration dates, inventory thresholds, and more. It also helps users plan meals based on available ingredients, making it easier to create recipes and generate shopping lists.

## Features

- **Inventory Management**: Track ingredients in your kitchen, including their quantities and expiration dates.
- **Recipe Generator**: Generate recipes based on available ingredients from your inventory.
- **Shopping List Generator**: Automatically generate shopping lists based on inventory thresholds and expiration dates.
- **User Account Management**: Allow users to create accounts, log in, and manage their data securely.

## Tech Stack

- **Front-End**: React.js
- **Back-End**: JavaScript, Node.js
- **Database**: MongoDB

## Features Overview

- **Inventory Tracking**: The app enables users to manage their kitchen ingredients, track their quantities, and set thresholds for low-stock items.
- **Expiration Dates**: Users can track expiration dates for items and get notifications when items are about to expire.
- **Recipe Suggestions**: The app generates recipe ideas based on the ingredients users have in stock, helping them cook meals with what they already have.
- **Shopping List Generation**: If an ingredient is running low or about to expire, the app will automatically suggest adding it to a shopping list.
- **File I/O**: Supports reading from and writing to files for better data management.

## Authors

- [Khanh Van](https://www.github.com/kvan278)
- [Kian Hakim](https://www.github.com/KianHm)

## Setup and Installation

To set up the Ingredience app locally, follow these steps:

1. Clone the repository:
   **git clone https://github.com/kvan278/ingredience.git**
2. Switch to the **Back-End branch** for back-end files:
   **git checkout Backend**
3. Then, install the back-end dependencies:
   **npm install**
4. Switch to the **Front-End branch** for front-end files:
   **git checkout Front-End**
5. Then, install the front-end dependencies:
   **npm install**
6. Set up your MongoDB database connection in the back-end's `.env` file.
7. Run the back-end server:
   **nodemon server.js**
8. Run the front-end development server:
   **npm run dev**
9. Open your browser and go to `http://localhost:5173` to start using the app.

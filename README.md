# TaxoraAI - Your Personal AI-Powered Finance Hub

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)](https://taxoraatai.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/React-Vite%20/%20TypeScript-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Database](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**TaxoraAI** is a modern, all-in-one financial dashboard designed to give users a comprehensive overview of their investments and tax compliance status. It features a sleek, responsive interface, real-time data synchronization, and a powerful admin panel for managing application-wide data.

![TaxoraAI Screenshot](https://i.imgur.com/YOUR_SCREENSHOT_URL.png) 
*(Note: Replace the above URL with a real screenshot of your deployed application)*

---

## ✨ Core Features

- **Real-time Admin-User Sync**: Updates made in the admin panel (e.g., market rates) are instantly reflected for all users. User requests appear immediately in the admin dashboard.
- **Comprehensive User Dashboard**:
    - **Portfolio Overview**: Track investments across Fixed Deposits, Recurring Deposits, Stocks, and more.
    - **HUF & Pension Tracking**: Dedicated sections to manage Hindu Undivided Family (HUF) assets and pension/PF balances.
    - **GST Compliance Center**: View filing deadlines, calculate taxes, and download essential GST forms.
- **Powerful Admin Panel**:
    - **Market Rate Control**: Dynamically update gold, silver, and market index rates for the entire application.
    - **User Request Management**: View and resolve user-submitted requests in a clean, tabbed interface.
- **Secure Authentication**: User login and data are managed securely, with portfolio data scoped to the logged-in user.
- **AI Assistant**: An integrated AI chat to help users with their financial queries. *(Future implementation)*

---

## 🚀 Tech Stack

- **Frontend**: [**React**](https://react.dev/) with [**Vite**](https://vitejs.dev/) for a lightning-fast development experience.
- **Language**: [**TypeScript**](https://www.typescriptlang.org/) for robust, type-safe code.
- **Styling**: [**Tailwind CSS**](https://tailwindcss.com/) with a custom, premium dark theme.
- **UI Components**: Built with [**Shadcn/UI**](https://ui.shadcn.com/) for accessible and reusable components.
- **Database**: [**MongoDB Atlas**](https://www.mongodb.com/atlas) for a scalable, cloud-based NoSQL database.
- **Deployment**: Hosted on [**Vercel**](https://vercel.com/), leveraging serverless functions for the backend API.

---

## 🏁 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Bun](https://bun.sh/) (as the package manager)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/prabu411/taxoraatai.git
    cd taxoraatai
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Set up environment variables:**
    - Create a new file named `.env.local` in the root of the project.
    - Add your MongoDB connection string to this file:
      ```env
      MONGODB_URI=mongodb+srv://<username>:<password>@<your-cluster-url>/taxoraatai?appName=Cluster0
      ```
    - Replace the placeholders with your actual MongoDB credentials.

4.  **Run the development server:**
    ```sh
    bun run dev
    ```
    The application should now be running on `http://localhost:5173`.

---

## ☁️ Deployment

This project is configured for seamless deployment on [**Vercel**](https://vercel.com/).

1.  Push your code to a GitHub repository.
2.  Import the repository into Vercel.
3.  Vercel will automatically detect the Vite preset.
4.  Configure the **Build & Development Settings** to use the `bun` commands:
    - **Build Command**: `bun run build`
    - **Install Command**: `bun install`
5.  Add your `MONGODB_URI` as an environment variable in the Vercel project settings.
6.  Click **Deploy**. Vercel will handle the rest, including setting up the serverless API routes from the `/api` directory.

---

## 📄 API Endpoints

The backend logic is handled by serverless functions located in the `/api` directory.

- `POST /api/login`: Authenticates a user.
- `GET /api/app-data`: Fetches initial data like market rates and admin requests.
- `POST /api/requests`: Creates a new user request.
- `PUT /api/requests`: Resolves an existing user request.
- `POST /api/market-rates`: Allows an admin to update market rates.
- `GET /api/portfolio?userId=<id>`: Fetches all portfolio data for a specific user.
- `POST /api/portfolio`: Creates or updates portfolio items (FD/RD, HUF/PF).
- `DELETE /api/portfolio`: Deletes a portfolio item.

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

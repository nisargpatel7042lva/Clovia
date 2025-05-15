# Clovia

Clovia is a premium, secure, and social Web3 experience built on Solana. It empowers users to earn while they connect, follow, and engage, merging entertainment with DeFi. Clovia is designed for the next generation of social staking and creator-backed economies.

## 🚀 App Idea & Vision

Clovia redefines the global social experience by:
- Turning everyday social media engagement into meaningful financial participation.
- Empowering users to earn and interact with DeFi features seamlessly.
- Providing a beautiful, modern, and secure mobile-first experience.
- Integrating Solana wallet features for real crypto utility.

## ✨ Features
- **Onboarding & Profile:**
  - Smooth onboarding with profile photo upload and user details.
  - Profile page with wallet address, posts, followers, and following.
- **Wallet Integration:**
  - Connect your Solana wallet and view your wallet address.
  - Fetch and display real-time SOL balance from the Solana blockchain.
- **Finances Tab:**
  - Connect wallet with a loading animation and see your wallet address.
  - View your current SOL balance and recent transactions.
- **Feed & Social:**
  - Post content, follow users, and interact with the community.
- **Settings:**
  - Change profile picture, view wallet details, and edit profile info.

## 📱 Screenshots
> _Add screenshots or a demo video here to showcase the UI and features._

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```sh
  npm install -g expo-cli
  ```
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/clovia.git
cd clovia
```

### 2. Install Dependencies
```sh
yarn install
# or
npm install
```

### 3. Configure Environment Variables
Create a `.env` file or set the required Firebase and Solana environment variables. See `lib/firebase.ts` for the required keys:
- FIREBASE_API_KEY
- FIREBASE_AUTH_DOMAIN
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_APP_ID
- FIREBASE_MEASUREMENT_ID

You can set these in your `app.json` or `.env` as per Expo's documentation.

### 4. Run the App
- **Android/iOS:**
  ```sh
  expo start
  ```
  Then scan the QR code with your Expo Go app, or run on an emulator/simulator.
- **Web:**
  ```sh
  expo start --web
  ```

## 🔑 Solana Wallet Integration
- The app uses `@solana/web3.js` to fetch wallet balances and interact with the Solana blockchain.
- You can connect your wallet in the Finances tab and see your address and balance.

## 🧩 Tech Stack
- **React Native** (with Expo)
- **Solana web3.js** for blockchain integration
- **Firebase** for backend and storage
- **TypeScript** for type safety
- **Modern UI/UX** with custom components

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](LICENSE)

---

_Clovia: Social. Secure. Staked. Powered by Solana._

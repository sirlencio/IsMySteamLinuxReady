## LinuxReady

**LinuxReady** is a web tool designed for gamers looking to migrate from Windows to Linux. It analyzes your Steam library and provides a detailed compatibility report using data from **ProtonDB** and **SteamGridDB**.

[![Netlify Status](https://api.netlify.com/api/v1/badges/9cfdf463-178a-4393-b599-19324322ba87/deploy-status)](https://app.netlify.com/projects/ismysteamlinuxready/deploys)

## The Mission
Windows is increasingly cluttered with telemetry and forced updates. With the rise of the **Steam Deck** and **Proton**, Linux has become a superior alternative for many. This project helps users visualize that their game library is already "Linux Ready".

## Tech Stack
- **Frontend:** React 18 + TypeScript + Tailwind CSS.
- **Routing:** React Router 7.
- **Backend:** Netlify Functions (Serverless Node.js).
- **Caching:** Upstash Redis (to optimize API rate limits and performance).
- **State Management:** React Hooks (Context/State).
- **Icons & UI:** Headless UI + Heroicons + Sonner (Toasts).

## Key Technical Challenges
### 1. SteamID Resolution
Users often paste their profile URL instead of their 64-bit SteamID. I implemented a **Serverless resolver** that detects the input type (URL, Vanity Name, or ID) and communicates with the Steam API to normalize the data before fetching the library.

### 2. High Performance Caching
Steam and ProtonDB APIs can be slow or have rate limits. To ensure a "snappy" user experience:
- I integrated **Upstash Redis** to cache compatibility results.
- This reduces the load time for popular profiles from ~3s to **less than 200ms** on subsequent visits.

### 3. Serverless Architecture
By using **Netlify Functions**, the project remains cost-effective and scalable. All sensitive API Keys (Steam, SteamGridDB, Redis) are handled server-side, keeping the client-side clean and secure.

## Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/sirlencio/IsMySteamLinuxReady
   ```
   Install dependencies:
   ```bash
    npm install
   ```
    Create a .env file in the root with your keys:
   ```
    STEAM_API_KEY=your_key
    STEAMGRIDDB_API_KEY=your_key
    UPSTASH_REDIS_REST_URL=your_url
    UPSTASH_REDIS_REST_TOKEN=your_token
   ```
    Run the development server (Netlify CLI recommended for Functions):
    ```bash
    netlify dev
    ```

## Attribution

  Data provided by [ProtonDB](https://www.protondb.com/).
  
  Assets and covers by [SteamGridDB](https://www.steamgriddb.com/).
  
  Built by Sirlencio.


![Logo](https://res.cloudinary.com/cloudtrial/image/upload/v1715092003/logo-whatsapp-transparent-background-22_zytltr.png)

# Whatsapp Clone App

This project is a modern, feature-rich WhatsApp clone built with Next.js, offering a seamless messaging experience with voice and video calling capabilities.

This project aims to replicate the core functionality of the popular messaging application while also providing end to end encryption and seamless voice & video calling capabilities.

## Features

- Authentication: Secure authentication system using Firebase Authentication for user registration and login. 
- Real-time Chat: Send and receive text messages instantaneously using WebSockets.
- End-to-End Encryption: Implement end-to-end encryption for messages to enhance security.
- Media Sharing: Share images within chats.
- Voice and Video Calls: Initiate voice and video calls with users providing a rich communication experience.
- Online Status: Display online/offline status of users in the chat.
- Read Receipts: Show when messages have been read.
- Search Bar: Manage your contacts and their messages with search functionality.
- Chat History: Access and view past chat conversations.
- User Profiles: View and edit your user profile information.

## Demo

The E-commerce website can be viewed online here:
https://whatsapp-clone-peach-nine.vercel.app

Check out demo video here: [Demo video](https://res.cloudinary.com/cloudtrial/video/upload/v1715411726/InShot_20240510_130024063_qgchjr.mp4)

## Screenshots

- Login Page
![Login](https://res.cloudinary.com/cloudtrial/image/upload/v1715094660/Screenshot_227_ptqst4.png)

- Home Page
![Home](https://res.cloudinary.com/cloudtrial/image/upload/v1715094662/Screenshot_225_pdxsbw.png)

- Calling Feature
![Calling Feature](https://res.cloudinary.com/cloudtrial/image/upload/v1715094663/Screenshot_229_zw7crm.png)

- Search Message
![Search Message](https://res.cloudinary.com/cloudtrial/image/upload/v1715094661/Screenshot_233_zulm6g.png)

- Profile
![Profile](https://res.cloudinary.com/cloudtrial/image/upload/v1715094661/Screenshot_232_hnohwl.png)

## Tech Stack

- Next.js (React framework for server-rendered and statically generated pages)
- React (JavaScript library for building user interfaces)
- Firebase - (Platform for Providing authentication)
- Socket.io - (Real-time communication library)
- Tailwind CSS - (Utility-first CSS framework)
- Express - (Node.js framework for building the backend API)
- ZegoCloud - (Voice and video calling service integration)
- PostgreSQL - (Relational database management system)

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js
- npm (Node Package Manager): Should be installed with Node.js
- Firebase account and project setup
- PostgreSQL database setup

## Getting Started

1. Clone the repository: 
```bash
 git clone https://github.com/Gpooja13/Whatsapp-Clone.git
```

2. Navigate to the project directory:
- For client side
```bash
cd client 
```
- For server side
```bash
cd server 
```

3. Install dependencies: 
```bash
npm install
```
4. Set up Firebase: 
Create a new Firebase project on the Firebase Console.
Enable Firebase Authentication.

5. Set up environment variables: 
Create a .env.local file in the root of your project and add the following environment variables.

- For client side
`ZEGO_APPID`
`ZEGO_SERVER_ID`
`NEXT_PUBLIC_HOST=http://localhost:3005`

- For server side
`DATABASE_URL`
`PORT`
`HOST=http://localhost:3000`
`ZEGO_APP_ID`
`ZEGO_SERVER_ID`

6. Run the development server: 
```bash
 npm run dev
```

7. Open your browser and navigate to http://localhost:3000 to see the project running.

## Further Development

- Group Chats: Create and participate in group conversations with multiple participants.
- File Sharing: Allow users to share documents and other files.
- Typing Indicators: Get notified when someone is typing a message.
- View Call history.
- Location Sharing: Allow users to share their location (requires user consent).
- Share auto delete story with contacts.
- Responsive Design: Fully responsive layout for seamless messaging and calling across devices.
- Customization: Easily customize the chat interface and styling using Tailwind CSS.

## Acknowledgements

This project was inspired by the functionality and design of WhatsApp.

Special thanks to the creators and maintainers of Next.js, Firebase, ZegoCloud, and Tailwind CSS for their amazing tools and documentation.

## Contact

For any questions or feedback, please contact: gpooja750@yahoo.com.



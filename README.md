# EternalLegacy - Digital Afterlife Memory Capsule

## Overview
EternalLegacy is a next-generation full-stack web application that serves as a digital afterlife memory capsule, powered by personalized AI and immersive interaction. The application allows users to preserve and deliver memories, messages, and media across time, featuring a unique 3D AI companion generated from the user's image and voice.

## Key Features

### Core Features
- **User Authentication**: Secure registration and login system
- **Legacy Creation**: Create and manage digital legacy collections
- **Media Management**: Upload, organize, and share images, videos, audio, and documents
- **Sharing & Privacy**: Granular control over who can access your legacies
- **Notification System**: Stay informed about legacy activities and collaborations

### Advanced Features
- **3D Clone Companion**: Generate a personalized 3D avatar from your photo and voice
- **Voice Cloning**: Create a digital version of your voice for your avatar
- **AI Guidance System**: Emotionally intelligent AI that guides loved ones through preserved memories
- **Interactive Timeline**: Organize memories chronologically with rich media support
- **Legacy Vault**: Time-locked messages or media capsules with customizable unlock events

## Technical Stack

### Frontend
- React with TypeScript
- Three.js and React-Three-Fiber for 3D rendering
- Tailwind CSS for styling
- React Router for navigation
- React Query for data fetching

### Backend
- Flask with Python
- PostgreSQL database with SQLAlchemy ORM
- JWT for authentication
- RESTful API architecture

### Third-Party Integrations
- DeepMotion/D-ID for 3D face generation
- ElevenLabs for voice cloning
- OpenAI for conversational AI

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL database
- API keys for third-party services (optional for full functionality)

### Installation

#### Backend Setup
1. Navigate to the backend directory:
   ```
   cd eternal-legacy-backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy the example environment file: `cp .env.example .env`
   - **Crucially, open the new `.env` file and set strong, unique values for `SECRET_KEY` and `JWT_SECRET_KEY`.**
     These keys are vital for your application's security. Do not use default or easily guessable values in production.
     You can generate a cryptographically secure key using Python:
     ```bash
     python -c 'import secrets; print(secrets.token_hex(32))' 
     ```
     Use the output of this command for your `SECRET_KEY` and `JWT_SECRET_KEY` (use different values for each).
   - Update other variables in `.env` as needed (database credentials, third-party API keys):
     ```ini
     # Example content of .env (ensure you update placeholder values)
     SECRET_KEY="YOUR_GENERATED_FLASK_SECRET_KEY"
     JWT_SECRET_KEY="YOUR_GENERATED_JWT_SECRET_KEY"
     
     DB_USERNAME="your_db_username"
     DB_PASSWORD="your_db_password"
     DB_HOST="localhost"
     DB_PORT="5432"
     DB_NAME="eternal_legacy"
     
     # API keys for third-party services (now used by backend proxy)
     # Only fill these if you intend to use the corresponding features.
     DEEPMOTION_API_KEY="YOUR_DEEPMOTION_API_KEY_HERE"
     ELEVENLABS_API_KEY="YOUR_ELEVENLABS_API_KEY_HERE"
     OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"

     # Optional: Max Upload Size in MB for media files (defaults to 16MB if not set)
     # MAX_UPLOAD_MB="16"
     ```

5. Initialize the database:
   ```
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. Run the backend server:
   ```
   python -m src.main
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd eternal-legacy-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the frontend directory
   - Add the following variable:
     ```
     REACT_APP_API_URL=http://localhost:5000
     ```
   - **Note:** API keys for DeepMotion/D-ID, ElevenLabs, and OpenAI are now managed by the backend. Do NOT put them in the frontend `.env` file.

4. Run the frontend development server:
   ```
   npm start
   ```

## API Documentation

### Authentication Endpoints
- `POST /auth/register`: Register a new user
- `POST /auth/login`: Log in an existing user
- `GET /auth/profile`: Get the current user's profile
- `PUT /auth/profile`: Update the current user's profile

### Legacy Endpoints
- `GET /api/legacies`: Get all legacies for the current user
- `POST /api/legacies`: Create a new legacy
- `GET /api/legacies/:id`: Get a specific legacy
- `PUT /api/legacies/:id`: Update a specific legacy
- `DELETE /api/legacies/:id`: Delete a specific legacy

### Media Endpoints
- `POST /api/media/upload`: Upload a media file
- `GET /api/media/files`: Get all media files for the current user
- `DELETE /api/media/files/:filename`: Delete a specific media file

### Avatar Endpoints (User-Facing & Documented)
These endpoints provide a consistent API for avatar-related operations and internally use the `/api/services/*` proxy to communicate with third-party services securely.
- `POST /api/avatar/generate`: Handles avatar generation requests. Internally calls `/api/services/avatar/generate`.
- `POST /api/avatar/voice`: Handles voice cloning requests. Internally calls `/api/services/voice/clone`.
- `POST /api/avatar/speech`: Handles speech synthesis requests. Internally calls `/api/services/voice/speak`.

### Service Proxy Endpoints (Internal Backend Infrastructure)
These endpoints are called by the `/api/avatar/*` wrapper endpoints and are responsible for the direct interaction with third-party services, using API keys stored on the backend.
- `POST /api/services/avatar/generate`: Proxies request to 3D avatar generation service (e.g., DeepMotion/D-ID).
- `POST /api/services/voice/clone`: Proxies request to voice cloning service.
- `POST /api/services/voice/speak`: Proxies request for text-to-speech.
- `POST /api/services/ai/chat`: Proxies request to conversational AI service.

## Project Structure

### Backend Structure
```
eternal-legacy-backend/
├── src/
│   ├── models/
│   │   ├── user.py
│   │   ├── legacy.py
│   │   └── ...
│   ├── routes/
│   │   ├── auth.py
│   │   ├── legacy.py
│   │   ├── media.py
│   │   └── ...
│   ├── static/
│   │   └── uploads/
│   └── main.py
├── venv/
└── requirements.txt
```

### Frontend Structure
```
eternal-legacy-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ThreeDCloneCompanion.tsx
│   │   ├── AIGuidanceSystem.tsx
│   │   ├── NotificationSystem.tsx
│   │   ├── SharingPrivacyControls.tsx
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LegacyDetail.tsx
│   │   ├── CreateLegacy.tsx
│   │   ├── Profile.tsx
│   │   ├── AvatarIntegrationPage.tsx
│   │   └── ...
│   ├── services/
│   │   └── AvatarAPIService.ts
│   └── App.tsx
└── package.json
```

## Third-Party API Integration

### DeepMotion/D-ID (3D Avatar Generation)
The application uses DeepMotion or D-ID API to generate 3D avatars from user photos. These calls are now proxied through the backend. To enable this functionality:
1. Sign up for an API key at [DeepMotion](https://www.deepmotion.com/) or [D-ID](https://www.d-id.com/).
2. Add your API key as `DEEPMOTION_API_KEY` (or a similar chosen name) in the backend's `.env` file.

### ElevenLabs (Voice Cloning)
The application uses ElevenLabs API for voice cloning and speech synthesis, proxied through the backend. To enable this functionality:
1. Sign up for an API key at [ElevenLabs](https://elevenlabs.io/).
2. Add your API key as `ELEVENLABS_API_KEY` in the backend's `.env` file.

### OpenAI (Conversational AI)
The application uses OpenAI API for the AI guidance system, proxied through the backend. To enable this functionality:
1. Sign up for an API key at [OpenAI](https://openai.com/).
2. Add your API key as `OPENAI_API_KEY` in the backend's `.env` file.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- Three.js for 3D rendering
- React and Flask for the application framework
- Tailwind CSS for styling
- All third-party API providers for their services

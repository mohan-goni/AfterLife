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
- MySQL database with SQLAlchemy ORM
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
- MySQL database
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
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     SECRET_KEY=your_secret_key
     DB_USERNAME=your_db_username
     DB_PASSWORD=your_db_password
     DB_HOST=localhost
     DB_PORT=3306
     DB_NAME=eternal_legacy
     JWT_SECRET_KEY=your_jwt_secret
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
   - Add the following variables (optional for full functionality):
     ```
     REACT_APP_API_URL=http://localhost:5000
     REACT_APP_AVATAR_API_KEY=your_deepmotion_or_did_api_key
     REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_api_key
     REACT_APP_OPENAI_API_KEY=your_openai_api_key
     ```

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

### Avatar Endpoints
- `POST /api/avatar/generate`: Generate a 3D avatar from an image
- `POST /api/avatar/voice`: Clone a voice from audio samples
- `POST /api/avatar/speech`: Generate speech from text using a cloned voice

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
The application uses DeepMotion or D-ID API to generate 3D avatars from user photos. To enable this functionality:
1. Sign up for an API key at [DeepMotion](https://www.deepmotion.com/) or [D-ID](https://www.d-id.com/)
2. Add your API key to the frontend environment variables

### ElevenLabs (Voice Cloning)
The application uses ElevenLabs API for voice cloning and speech synthesis. To enable this functionality:
1. Sign up for an API key at [ElevenLabs](https://elevenlabs.io/)
2. Add your API key to the frontend environment variables

### OpenAI (Conversational AI)
The application uses OpenAI API for the AI guidance system. To enable this functionality:
1. Sign up for an API key at [OpenAI](https://openai.com/)
2. Add your API key to the frontend environment variables

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- Three.js for 3D rendering
- React and Flask for the application framework
- Tailwind CSS for styling
- All third-party API providers for their services

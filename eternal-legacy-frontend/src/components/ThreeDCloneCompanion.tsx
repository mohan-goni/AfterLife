import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Avatar component that will be rendered in the 3D scene
const Avatar = ({ modelUrl }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  // For now, we'll use a simple sphere as a placeholder for the avatar
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4A2545" />
    </mesh>
  );
};

// Scene setup component
const Scene = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.z = 5;
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Avatar />
      <OrbitControls />
    </>
  );
};

// Main 3D Clone Companion component
const ThreeDCloneCompanion = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [avatarGenerated, setAvatarGenerated] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Handle image upload for avatar generation
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start recording voice samples
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop recording voice samples
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Generate avatar from uploaded image and recorded voice
  const generateAvatar = () => {
    // This would be replaced with actual API calls to DeepMotion/D-ID and ElevenLabs
    console.log('Generating avatar from image and voice...');
    
    // Simulate processing time
    setTimeout(() => {
      setAvatarGenerated(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">3D Clone Companion</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Create Your Digital Avatar
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Upload a front-facing photo and record your voice to create a personalized 3D avatar that will guide your loved ones through your memories.
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Left column: Image upload and voice recording */}
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Your Photo
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {uploadedImage ? (
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded face" 
                            className="mx-auto h-32 w-32 object-cover rounded-full"
                          />
                        ) : (
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a photo</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Record Your Voice
                    </label>
                    <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 rounded-md">
                      {recordedAudio ? (
                        <div className="w-full">
                          <audio src={recordedAudio} controls className="w-full mb-4" />
                          <button
                            type="button"
                            onClick={() => setRecordedAudio(null)}
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Record Again
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mx-auto mb-4">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-500 mb-4">
                            Record a sample of your voice for the AI to learn from.
                            <br />
                            Read a paragraph of text naturally for best results.
                          </p>
                          <button
                            type="button"
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                          >
                            {isRecording ? (
                              <>
                                <span className="animate-pulse mr-2 h-3 w-3 rounded-full bg-red-200"></span>
                                Stop Recording
                              </>
                            ) : (
                              'Start Recording'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={generateAvatar}
                      disabled={!uploadedImage || !recordedAudio}
                      className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        !uploadedImage || !recordedAudio
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                    >
                      Generate 3D Avatar
                    </button>
                  </div>
                </div>

                {/* Right column: 3D avatar preview */}
                <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  <Canvas>
                    <Scene />
                  </Canvas>
                </div>
              </div>

              {/* Avatar customization options (shown after generation) */}
              {avatarGenerated && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Customize Your Avatar
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voice Tone
                      </label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option>Natural</option>
                        <option>Warm</option>
                        <option>Professional</option>
                        <option>Friendly</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avatar Style
                      </label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option>Realistic</option>
                        <option>Stylized</option>
                        <option>Animated</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Avatar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThreeDCloneCompanion;

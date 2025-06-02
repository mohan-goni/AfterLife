import os
from flask import Blueprint, request, jsonify
import logging

# Setup logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

external_services_bp = Blueprint('external_services', __name__)

# Helper to get API key from environment
def get_api_key(service_name):
    key = os.environ.get(service_name)
    if not key:
        logger.error(f"{service_name} is not set in environment variables.")
    return key

@external_services_bp.route('/avatar/generate', methods=['POST'])
def generate_avatar_proxy():
    # This endpoint would receive image data from the frontend
    # For now, we'll just simulate receiving some data
    data = request.form # Assuming form data with 'image' field
    image_file = request.files.get('image') # Example: if image is sent as a file

    api_key = get_api_key("DEEPMOTION_API_KEY") # Or D_ID_API_KEY

    if not api_key:
        return jsonify({'error': 'Avatar generation service API key not configured on server.'}), 500

    if image_file:
        logger.info(f"Received image: {image_file.filename}")
        logger.info(f"Proxying to DeepMotion/D-ID API (mock). API Key available: {'Yes' if api_key else 'No'}")
        # Here, you would make the actual call to DeepMotion/D-ID
        # e.g., files = {'image': (image_file.filename, image_file.stream, image_file.mimetype)}
        # response = requests.post("https://api.deepmotion.com/...", headers={"X-Api-Key": api_key}, files=files)
        # return jsonify(response.json()), response.status_code
        return jsonify({
            'message': 'Avatar generation request received by proxy (mocked response).',
            'mock_avatar_id': 'proxied-avatar-123',
            'mock_avatar_url': 'https://example.com/proxied_avatar.glb'
        }), 200
    elif data:
        logger.info(f"Received data for avatar generation: {data}")
        logger.info(f"Proxying to DeepMotion/D-ID API (mock). API Key available: {'Yes' if api_key else 'No'}")
        return jsonify({
            'message': 'Avatar generation request (form data) received by proxy (mocked response).',
            'mock_avatar_id': 'proxied-avatar-data-123',
            'mock_avatar_url': 'https://example.com/proxied_avatar_data.glb'
        }), 200
    else:
        return jsonify({'error': 'No image data provided for avatar generation.'}), 400

@external_services_bp.route('/voice/clone', methods=['POST'])
def clone_voice_proxy():
    # This endpoint would receive audio data from the frontend
    data = request.files.get('audio') # Assuming 'audio' file part

    api_key = get_api_key("ELEVENLABS_API_KEY")

    if not api_key:
        return jsonify({'error': 'Voice cloning service API key not configured on server.'}), 500

    if data:
        logger.info(f"Received audio file: {data.filename} for voice cloning.")
        logger.info(f"Proxying to ElevenLabs API (mock). API Key available: {'Yes' if api_key else 'No'}")
        # Here, you would make the actual call to ElevenLabs
        # e.g., files = {'audio': (data.filename, data.stream, data.mimetype)}
        # response = requests.post("https://api.elevenlabs.io/v1/voices/add", headers={"xi-api-key": api_key}, files=files)
        # return jsonify(response.json()), response.status_code
        return jsonify({
            'message': 'Voice cloning request received by proxy (mocked response).',
            'mock_voice_id': 'proxied-voice-456'
        }), 200
    else:
        return jsonify({'error': 'No audio data provided for voice cloning.'}), 400

@external_services_bp.route('/ai/chat', methods=['POST'])
def ai_chat_proxy():
    # This endpoint would receive chat message and context
    data = request.get_json()
    message = data.get('message')
    legacy_id = data.get('legacyId')
    conversation_history = data.get('conversationHistory', [])

    api_key = get_api_key("OPENAI_API_KEY")

    if not api_key:
        return jsonify({'error': 'AI service API key not configured on server.'}), 500

    if message:
        logger.info(f"Received chat message: '{message}' for legacyId: {legacy_id}")
        logger.info(f"Conversation history length: {len(conversation_history)}")
        logger.info(f"Proxying to OpenAI API (mock). API Key available: {'Yes' if api_key else 'No'}")
        # Here, you would make the actual call to OpenAI
        # e.g., payload = { "model": "gpt-4", "messages": [...] }
        # response = requests.post("https://api.openai.com/v1/chat/completions", headers={"Authorization": f"Bearer {api_key}"}, json=payload)
        # return jsonify(response.json()), response.status_code
        mock_ai_response = "This is a proxied and mocked AI response. You asked about: " + message
        return jsonify({
            'message': 'AI chat request received by proxy (mocked response).',
            'response': mock_ai_response
        }), 200
    else:
        return jsonify({'error': 'No message provided for AI chat.'}), 400

@external_services_bp.route('/voice/speak', methods=['POST'])
def speak_text_proxy():
    # This endpoint would receive text and a voice ID
    data = request.get_json()
    text = data.get('text')
    voice_id = data.get('voiceId')

    api_key = get_api_key("ELEVENLABS_API_KEY")

    if not api_key:
        return jsonify({'error': 'Text-to-speech service API key not configured on server.'}), 500

    if text and voice_id:
        logger.info(f"Received text: '{text}' for voice_id: {voice_id} for speech synthesis.")
        logger.info(f"Proxying to ElevenLabs API (mock). API Key available: {'Yes' if api_key else 'No'}")
        # Here, you would make the actual call to ElevenLabs
        # response = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}", headers={"xi-api-key": api_key}, json={"text": text})
        # return response.content, response.status_code, {'Content-Type': 'audio/mpeg'}
        return jsonify({
            'message': 'Speech generation request received by proxy (mocked response).',
            'mock_audio_url': 'https://example.com/proxied_speech.mp3'
        }), 200
    else:
        return jsonify({'error': 'Missing text or voiceId for speech synthesis.'}), 400

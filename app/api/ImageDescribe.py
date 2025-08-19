import os
import json
from PIL import Image
import base64
from io import BytesIO
import time
import google.generativeai as genai
from google.genai import types

GEMINI_API = "replace_me"

def ImageDescribe():
    genai.configure(api_key=GEMINI_API)
    
    base_path = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'output')
    raw_image_data = {
        'profile': '',
        'posts': {}
    }

    # Path for post images
    post_images = []
    for i in range(1, (3 + 1)):
        post_path = os.path.join(base_path, f'post{i}.jpg')
        if os.path.exists(post_path):
            print(f"Found post{i}.jpg")
            post_images.append(post_path)
    
    profile_image = os.path.join(base_path, 'profile.jpg')
    if os.path.exists(profile_image):
        print("Found profile.jpg")
    else:
        profile_image = None
    
    all_images = post_images + ([profile_image] if profile_image else [])

    # Process each existing image
    for image_path in all_images:
        if os.path.exists(image_path):
            print(f"Processing {image_path}")
            try:
                # Load and process image
                with Image.open(image_path) as img:
                    # Process with Gemini with retry mechanism
                    max_retries = 3
                    for attempt in range(max_retries):
                        try:
                            model = genai.GenerativeModel('gemma-3-27b-it')
                            
                            # Prepare image for Gemini
                            if img.mode != 'RGB':
                                img = img.convert('RGB')
                            
                            # Create BytesIO object to hold the image data
                            buffered = BytesIO()
                            img.save(buffered, format="JPEG")
                            image_bytes = buffered.getvalue()
                            
                            # Create image part for Gemini
                            image_part = {
                                "mime_type": "image/jpeg",
                                "data": base64.b64encode(image_bytes).decode('utf-8')
                            }
                            
                            prompt = "Describe this image in detail in Bahasa Indonesia"
                            
                            response = model.generate_content([prompt, image_part])
                            response_text = response.text
                            break
                        except Exception as e:
                            if attempt == max_retries - 1:
                                print(f"Failed to process image after {max_retries} attempts: {str(e)}")
                                response_text = "Failed to process image"
                            else:
                                time.sleep(2)  # Wait before retrying
                
                filename = os.path.basename(image_path)
                if filename == 'profile.jpg':
                    raw_image_data['profile'] = response_text
                else:
                    post_number = filename.replace('post', '').replace('.jpg', '')
                    raw_image_data['posts'][f'post{post_number}'] = response_text

            except Exception as e:
                print(f"Error processing {image_path}: {str(e)}")

    # Save to JSON file
    output_json_path = os.path.join(base_path, 'image_data.json')
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(raw_image_data, f, indent=2)
    
    return raw_image_data

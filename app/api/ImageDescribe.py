import os
import json
from groq import Groq
from PIL import Image
import base64
from io import BytesIO
import time

GROQ_API = "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"

def ImageDescribe():
    client = Groq(api_key=GROQ_API)
    
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
                # Convert image to base64
                with Image.open(image_path) as img:
                    buffered = BytesIO()
                    img.save(buffered, format="JPEG")
                    img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
                    img_url = f"data:image/jpeg;base64,{img_base64}"

                # Process with Groq with retry mechanism
                max_retries = 3
                for attempt in range(max_retries):
                    try:
                        completion = client.chat.completions.create(
                            model="llama-3.2-90b-vision-preview",
                            messages=[
                                {
                                    "role": "user",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Describe this image in detail in Bahasa Indonesia"
                                        },
                                        {
                                            "type": "image_url",
                                            "image_url": {
                                                "url": img_url
                                            }
                                        }
                                    ]
                                }
                            ],
                            temperature=0.7,
                            max_completion_tokens=516,
                            top_p=1,
                            stream=False
                        )
                        
                        response_text = completion.choices[0].message.content
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

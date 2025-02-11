import ollama
import os
import json

def ImageDescribe():
    base_path = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'output')
    # Initialize RawData dictionary
    raw_image_data = {
        'profile': '',
        'posts': {}
    }

    # Path for post images
    post_images = []
    for i in range(1, 4):
        post_path = f"{base_path}\\post{i}.jpg"
        if os.path.exists(post_path):
            print(f"Found post{i}.jpg")
            post_images.append(post_path)
    
    profile_image = f"{base_path}\\profile.jpg"
    if os.path.exists(profile_image):
        print("Found profile.jpg")
    else:
        profile_image = None
    
    all_images = post_images + ([profile_image] if profile_image else [])

    # Process each existing image
    for image_path in all_images:
        if os.path.exists(image_path):
            print(f"Processing {image_path}")
            res = ollama.chat(
                model='llava',
                messages=[{
                    'role': 'user',
                    'content': 'Describe this image',
                    'images': [image_path]
                }]
            )
            
            filename = os.path.basename(image_path)
            if filename == 'profile.jpg':
                raw_image_data['profile'] = res['message']['content']
            else:
                post_number = filename.replace('post', '').replace('.jpg', '')
                raw_image_data['posts'][f'post{post_number}'] = res['message']['content']

    # Save to JSON file
    output_json_path = os.path.join(base_path, 'image_data.json')
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(raw_image_data, f, indent=2)
    
    return raw_image_data

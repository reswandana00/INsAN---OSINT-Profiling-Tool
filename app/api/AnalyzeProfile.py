import ollama
import os
import json
from ImageDescribe import ImageDescribe

# Create the analysis prompt
def AnalyzeProfile():
    base_path = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'output')
    raw_data = {
        'bio': {},
        'images': {}
    }

    # Read bio.json file
    bio_path = os.path.join(base_path, 'bio.json')
    if os.path.exists(bio_path):
        with open(bio_path, 'r', encoding='utf-8') as f:
            raw_data['bio'] = json.load(f)
    
    raw_data['images'] = ImageDescribe()

    template = """
Make a comprehensif Profile of some one base on description of this person.
Predict Real name base on username
For behaviour context just predict it base on the information and trend or genre
Predict all aspect of this person based on the information given i wish it have at lease 60%
dont have to 100% true for behaviour context but it have to describe person from the lifestyle

Templates:

Personal Information...
Name :
Hobby :
Age (Range) :
Sex :
Job (have or not):
Location (if exist) :

Behaviour Context...
Taste of Music :
Taste of Movie :
Favorite Color :
Favorite Food :
Favorite Sport :
Favorite Animal :
Favorite Book :
Favorite TV Show :
Favorite Game :

Additional Information :"""

    # Combine all data into a single context string
    context = "Bio Information:\n" + json.dumps(raw_data['bio'], indent=2)
    context += "\n\nImage Descriptions:\n"
    for img_name, desc in raw_data['images'].items():
        context += f"\n{img_name}:\n{desc}\n"


    print("Analyzing profile...")
    # Get the final analysis
    final_analysis = ollama.chat(
        model='llava',  # or your preferred model
        messages=[{
            'role': 'user',
            'content': f"{template}\n\nBased on this information:\n{context}"
        }]
    )

    # Save all results
    output_path = os.path.join(base_path, 'analysis_results.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({
            'raw_data': raw_data,
            'analysis': final_analysis['message']['content']
        }, f, indent=2)

    return final_analysis['message']['content']
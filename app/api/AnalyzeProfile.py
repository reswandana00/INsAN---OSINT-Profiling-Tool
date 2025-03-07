import os
import json
from groq import Groq
from ImageDescribe import ImageDescribe

GROQ_API = "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"

def GenerateBio():
    client = Groq(api_key=GROQ_API)
    base_path = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'output')

    raw_data = {
        'bio': {},
        'analysis': '',
        'type': 'person'  # Add default type
    }

    # Read output.json
    output_path = os.path.join(base_path, 'output.json')
    if os.path.exists(output_path):
        with open(output_path, 'r', encoding='utf-8') as f:
            raw_data['bio'] = json.load(f)

    # Read analysis.json and extract content before "Behaviour Context:"
    analysis_path = os.path.join(base_path, 'analysis_results.json')
    if os.path.exists(analysis_path):
        with open(analysis_path, 'r', encoding='utf-8') as f:
            analysis_data = json.load(f)
            analysis_text = analysis_data.get('analysis', '')
            # Split at "Behaviour Context:" and take the first part
            raw_data['analysis'] = analysis_text.split('Behaviour Context:')[0].strip()

    bio_template = """
Make a simple brief profile of someone based on the description of this person. Force to fill all needed template fields.
Predict the real name based on the username.
For Job and location dont have to explain in long sentences.
Output number as number not words. but if K, M, B still use words.
Don't mess with the structure of the template:

Fill in the data values in Indonesian, but do not translate the template labels.
Just Fill template without creating new paragraphs

DONT translate the template labels to indonesian..

First, determine the type and output exactly one of these values:
TYPE: person
or
TYPE: non-person

Name :
Followers :
Following :
Bio :
Age (Range) :
Sex :
Job (have or not) :
Location (if exist) :

if the data was non person do with 

Name :
Followers :
Following :
Bio :
About :
"""

    # Combine data into context
    context = "Bio Information:\n" + json.dumps(raw_data['bio'], indent=2)
    context += "\n\nPrevious Analysis:\n" + raw_data['analysis']

    print("Analyzing profile...")
    completion = client.chat.completions.create(
        model="llama-3.2-90b-vision-preview",
        messages=[
            {
                "role": "user",
                "content": f"{bio_template}\n\nBased on this information:\n{context}"
            }
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None
    )

    response_text = completion.choices[0].message.content

     # Extract type from response
    if "TYPE: person" in response_text:
        raw_data['type'] = "person"
    elif "TYPE: non-person" in response_text:
        raw_data['type'] = "non-person"

    # Save as bio_analysis.json
    bio_analysis_path = os.path.join(base_path, 'bio_analysis.json')
    with open(bio_analysis_path, 'w', encoding='utf-8') as f:
        json.dump({
            'analysis': response_text,
            'type': raw_data['type']  # Include type in output
        }, f, indent=2)

    return response_text


def AnalyzeProfile():
    client = Groq(api_key=GROQ_API)
    
    base_path = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'output')
    raw_data = {
        'bio': {},
        'images': {},
        'type': 'person'  # Add default type
    }

    # Read bio.json file
    bio_path = os.path.join(base_path, 'bio.json')
    if os.path.exists(bio_path):
        with open(bio_path, 'r', encoding='utf-8') as f:
            raw_data['bio'] = json.load(f)
    
    raw_data['images'] = ImageDescribe()

    template = """
Make a comprehensive profile of someone based on the description of this person. Force to fill all needed template fields.
Predict the real name based on the username.
For behaviour context, predict it based on the information, trends, or genre—force predictions.
Predict all aspects of this person based on the information given, aiming for at least 60% accuracy.
It doesn't have to be 100% true for behaviour context, but it must describe the person based on their lifestyle.

when predict name dont get so far just close to username

DONT translate the template labels.

Don't mess with the structure of the template:
DON'T change this [Behaviour Context:, Additional Information:]—just keep them in English.

Fill in the data values in Indonesian, but do not translate the template labels.

First, determine the type and output exactly one of these values:
TYPE: person
or
TYPE: non-person

Name :
Hobby :
Age (Range) :
Sex :
Job (have or not):
Location (if exist) :

Behaviour Context:
Taste of Music :
Taste of Movie :
Favorite Color :
Favorite Food :
Favorite Sport :
Favorite Animal :
Favorite Book :
Favorite TV Show :
Favorite Game :

Additional Information:

if the data was non person just do

Name :
Hobby :
Location (if exist) :

Additional Information:
"""

    # Combine all data into a single context string
    context = "Bio Information:\n" + json.dumps(raw_data['bio'], indent=2)
    context += "\n\nImage Descriptions:\n"
    for img_type, desc in raw_data['images'].items():
        if isinstance(desc, dict):
            for post_num, post_desc in desc.items():
                context += f"\n{post_num}:\n{post_desc}\n"
        else:
            context += f"\n{img_type}:\n{desc}\n"

    print("Analyzing profile...")
    # Get the final analysis using Groq
    completion = client.chat.completions.create(
        model="llama-3.2-90b-vision-preview",
        messages=[
            {
                "role": "user",
                "content": f"{template}\n\nBased on this information:\n{context}"
            }
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None
    )

    response_text = completion.choices[0].message.content

     # Extract type from response
    if "TYPE: person" in response_text:
        raw_data['type'] = "person"
    elif "TYPE: non-person" in response_text:
        raw_data['type'] = "non-person"

    # Save all results
    output_path = os.path.join(base_path, 'analysis_results.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({
            'raw_data': raw_data,
            'analysis': response_text,
            'type': raw_data['type']  # Include type in output
        }, f, indent=2)

    return response_text

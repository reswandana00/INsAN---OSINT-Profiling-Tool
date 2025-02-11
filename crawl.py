import requests

url = "https://www.instagram.com/latief_reswandana/"  # Ganti dengan URL yang benar
response = requests.get(url)

# Cek status code dulu
if response.status_code == 200:
    try:
        data = response.json()
        profile_pic_url = data.get("data", {}).get("user", {}).get("hd_profile_pic_url_info", {}).get("url")
        print(profile_pic_url)
    except requests.exceptions.JSONDecodeError:
        print("Response bukan JSON yang valid")
else:
    print(f"Request gagal dengan status code: {response.status_code}")
    print(f"Response Text: {response.text}")  # Debugging output

import requests
import os

LOGOS = {
    "gatik_logo.png": "https://logo.clearbit.com/gatik.ai",
    "honda_logo.png": "https://logo.clearbit.com/honda.com",
    "asu_logo.png": "https://logo.clearbit.com/asu.edu",
    "jenius_logo.png": "https://logo.clearbit.com/jeniusbank.com"
}

# Fallbacks if Clearbit fails (using UI Avatars)
FALLBACKS = {
    "gatik_logo.png": "https://ui-avatars.com/api/?name=Gatik+AI&background=0D8ABC&color=fff&size=200",
    "honda_logo.png": "https://ui-avatars.com/api/?name=Honda+Research&background=c00000&color=fff&size=200",
    "asu_logo.png": "https://ui-avatars.com/api/?name=ASU&background=8C1D40&color=fff&size=200",
    "jenius_logo.png": "https://ui-avatars.com/api/?name=Jenius+Bank&background=000&color=fff&size=200"
}

OUTPUT_DIR = "assets/images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def download_file(url, filename):
    print(f"Downloading {filename} from {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            with open(os.path.join(OUTPUT_DIR, filename), "wb") as f:
                f.write(response.content)
            print(f"Success: {filename}")
            return True
        else:
            print(f"Failed: {filename} (Status {response.status_code})")
            return False
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
        return False

for filename, url in LOGOS.items():
    success = download_file(url, filename)
    if not success:
        print(f"Attempting fallback for {filename}...")
        fallback_url = FALLBACKS[filename]
        download_file(fallback_url, filename)

import requests
from bs4 import BeautifulSoup
import json
import re
import datetime

# Profile ID from: https://scholar.google.com/citations?user=TndS5QcAAAAJ&hl=en
SCHOLAR_ID = "TndS5QcAAAAJ"
OUTPUT_FILE = "data/scholar.json"

def fetch_citations():
    url = f"https://scholar.google.com/citations?user={SCHOLAR_ID}&hl=en"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        
        # citation count is usually in a table with id="gsc_rsb_st"
        # The first number in the first row is "All" citations
        stats_table = soup.find("table", id="gsc_rsb_st")
        
        if stats_table:
            # Get the first row's first data cell
            citations_element = stats_table.find_all("td", class_="gsc_rsb_std")[0]
            citations = int(citations_element.text)
            
            # h-index (2nd row)
            h_index_element = stats_table.find_all("td", class_="gsc_rsb_std")[2]
            h_index = int(h_index_element.text)
            
            # i10-index (3rd row)
            i10_index_element = stats_table.find_all("td", class_="gsc_rsb_std")[4]
            i10_index = int(i10_index_element.text)

            data = {
                "citations": citations,
                "h_index": h_index,
                "i10_index": i10_index,
                "last_updated": datetime.date.today().isoformat()
            }
            
            with open(OUTPUT_FILE, "w") as f:
                json.dump(data, f, indent=2)
            
            print(f"Successfully updated scholar data: {data}")
            
        else:
            print("Could not find stats table.")

    except Exception as e:
        print(f"Error fetching data: {e}")

if __name__ == "__main__":
    fetch_citations()

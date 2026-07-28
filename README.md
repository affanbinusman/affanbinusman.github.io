# Personal Website (affanbinusman.github.io)

This is the source code for my personal portfolio website, built with HTML, CSS, and JavaScript.


## 🌐 View Live

You can view the live deployed website at:
**[https://affanbinusman.github.io/](https://affanbinusman.github.io/)**

## 🚀 Running Locally


### Option 1: Using Docker (Recommended)
This method ensures the environment is consistent and dependencies are managed.

**Prerequisites:**
- Docker installed and running.

**Steps:**
1.  Open a terminal in the project directory.
2.  Run the following command to start the container:
    ```bash
    docker-compose up -d
    ```
3.  Open your browser and navigate to:
    [http://localhost:8080](http://localhost:8080)

To stop the container:
```bash
docker-compose down
```

### Option 2: Using Python Simple Server
If you don't want to use Docker, you can serve the site using Python's built-in HTTP server.

**Prerequisites:**
- Python 3 installed.

**Steps:**
1.  Open a terminal in the project directory.
2.  Run the following command:
    ```bash
    python3 -m http.server 8000
    ```
3.  Open your browser and navigate to:
    [http://localhost:8000](http://localhost:8000)

## 📂 Project Structure

-   `index.html`: The main entry point for the website.
-   `assets/`: Contains static assets like CSS, JavaScript, and images.
    -   `css/style.css`: Main stylesheet.
    -   `js/main.js`: Main JavaScript logic.
    -   `images/`: Image assets.
-   `data/`: JSON files containing the site's content.
    -   `profile.json`: Personal information.
    -   `experience.json`: Work experience.
    -   `education_pubs.json`: Education and publications.
    -   `projects.json`: Project details.
    -   `skills.json`: Skills and technologies.
    -   `scholar.json`: Google Scholar data.

## 🛠️ Making Changes
-   **Content**: Edit the JSON files in the `data/` directory to update text content without modifying HTML.
-   **Styles**: Update `assets/css/style.css`.
-   **Logic**: Update `assets/js/main.js`.

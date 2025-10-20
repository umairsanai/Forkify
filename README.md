# 🍴 Forkify: Cook Your Way

Forkify is a dynamic web application that allows you to search, create, and manage your favorite recipes. It provides an interactive interface for discovering new dishes, adjusting serving sizes on the fly, and bookmarking recipes for later.

All your custom recipes and bookmarks are saved directly in your browser using `localStorage`, so your data persists even after you close the tab.

## ✨ Features

* **Recipe Search:** Instantly search a database of over 1,000,000 recipes.
* **Add Your Own Recipes:** Create and add your own custom recipes. These are stored locally and are visible only to you.
* **Dynamic Servings:** Easily adjust the number of servings for any recipe, and the ingredient quantities will update automatically.
* **Bookmarks:** Save your favorite recipes to a bookmarks list for quick access.
* **Persistent Storage:** Your bookmarks and custom-added recipes are saved using `localStorage`, ensuring they are not lost when you close the browser.

## 💻 Tech Stack

* HTML5
* CSS3
* JavaScript (ES6+)
* [Parcel](https://parceljs.org/) (as the development server and bundler)
* `localStorage` for browser storage

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You must have [Node.js](https://nodejs.org/) and `npm` (Node Package Manager) installed on your machine.
* You can download Node.js (which includes npm) [here](https://nodejs.org/).

### Installation & Setup

1.  **Clone the repository** to your local machine:
    ```sh
    git clone https://github.com/umairsanai/Forkify.git
    ```

2.  **Navigate to the project directory**:
    ```sh
    cd Forkify
    ```

3.  **Install the required `npm` modules** (this will install dependencies like `fraction.js`, and the Parcel bundler):
    ```sh
    npm install
    ```

4.  **Run the development server**:
    ```sh
    npm run start
    ```

5.  This command will start the Parcel development server and provide you with a local URL in your terminal (usually `http://localhost:1234`). Open this link in your browser to use the application!

## Usage

1.  Type a query (e.g., "pizza") into the search bar and click **Search**.
2.  Click on a recipe from the results list to view its details.
3.  Use the `+` and `-` buttons on the recipe view to adjust the serving size.
4.  Click the **bookmark icon** to save (or remove) a recipe from your bookmarks.
5.  Click the **Add Recipe** button in the navigation bar to upload your own.
6.  View all your saved recipes by clicking the **Bookmarks** button.

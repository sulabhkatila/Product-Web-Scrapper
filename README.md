# Chrome Extension to Scrap Products and Compare Prices

https://github.com/sulabhkatila/Product-Web-Scrapper/assets/113466992/2e3fcf6a-7c26-4d42-9d9b-abb70fbd13cf

## Project Structure

The project consists of two main parts:

1. **Client**: This is the Chrome extension that provides the user interface. When you search for a product on Amazon, the extension sends a request to the server with the name of the product.

2. **Server**: This is a Flask API that scrapes eBay for the requested product. It returns a JSON object with the details of the products found, including the image, link, price, and title.

## Installation

To use this extension, follow these steps:

1. Download the `client` folder from this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable Developer Mode by clicking the toggle switch next to "Developer mode".
4. Click the "Load unpacked" button and select the `client` folder.
5. Pin the extension to your toolbar for easy access.

## Usage

1. Click the extension icon in your toolbar and turn on the switch.
2. Go to Amazon and search for a product. The extension will display the prices of similar products on eBay.
3. Use the "Toggle" button to show or hide the eBay product sidebar.
4. To sort the eBay products by price, use the "$->$$$" button for ascending order (cheapest to most expensive), and the "$$$ -> $" button for descending order (most expensive to cheapest).
5. If you prefer to view the products in their original eBay order, click the "Unsort" button.

## Design Considerations

The primary motivation behind the design considerations in this project was to learn web scraping in Python.
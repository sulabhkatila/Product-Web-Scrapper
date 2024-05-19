from flask import Flask

from scrappers import Ebay
from settings import DEBUG, PORT

app = Flask("Scrapper API")


@app.route("/ebay/<product>")
def get_product_from_ebay(product):
    product_name = product
    ebay = Ebay(product_name)
    return {"products": ebay.scrape()}


if __name__ == "__main__":
    app.run(port=PORT, debug=DEBUG)

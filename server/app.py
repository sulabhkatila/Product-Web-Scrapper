from flask import Flask, request
from scrappers import Ebay
from settings import DEBUG, PORT

app = Flask("Scrapper API")

app = Flask("Scrapper API")


@app.route("/ebay/<product>")
def get_product_from_ebay(product):
    product_name = product
    limit = int(request.args.get("limit")) if request.args.get("limit") else None
    price_less_than = (
        int(request.args.get("price-less-than"))
        if request.args.get("price-less-than")
        else None
    )
    ebay = Ebay(product_name)
    return {"products": ebay.scrape(limit, price_less_than)}


if __name__ == "__main__":
    app.run(port=PORT, debug=DEBUG)

from flask import Flask, request
from scrappers import Ebay
from settings import DEBUG, PORT

app = Flask("Scrapper API")
ebay = Ebay()


@app.route("/ebay/<product>")
def get_product_from_ebay(product):
    # Allow anyone to access the api
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
        }
        return ("", 204, headers)

    headers = {
        "Access-Control-Allow-Origin": "*",
    }
    product_name = product
    limit = int(request.args.get("limit")) if request.args.get("limit") else None
    price_less_than = (
        int(request.args.get("price-less-than"))
        if request.args.get("price-less-than")
        else None
    )
    response = {
        "products": ebay.scrape(
            limit=limit, price_less_than=price_less_than, product_name=product_name
        )
    }
    return response, 200, headers


if __name__ == "__main__":
    app.run(port=PORT, debug=DEBUG)

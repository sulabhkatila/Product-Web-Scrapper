import requests
from bs4 import BeautifulSoup as bs


class Scraper:
    # Base Class of all scrappers

    def __init__(self, product_name):

        self.product_name = product_name
        html = requests.get(self._url + product_name).text
        self._soup = bs(html, "html.parser")

    def __str__(self):
        return f"Scraper for product: {self.product_name} at URL: {self._url + self.product_name}"

    def scrape(self, limit=None):

        product_divs = self.get_product_divs()
        res = []
        for div in product_divs[:limit]:
            title = self.get_title(div)
            price = self.get_price(div)
            image = self.get_image_src(div)
            res.append({"title": title, "price": price, "image": image})
        return res


class Ebay(Scraper):

    __slots__ = [
        "_url",
        "_item_div_class",
        "_title_div_class",
        "_price_div_class",
        "_price_class",
        "_image_div_class",
        "_soup",
    ]

    def __init__(self, product_name):
        self._url = "https://www.ebay.com/sch/i.html?_nkw="
        self._item_div_class = "s-item__wrapper"
        self._title_div_class = "s-item__title"
        self._price_div_class = "s-item__detail s-item__detail--primary"
        self._price_class = "s-item__price"
        self._image_div_class = "s-item__image-section"
        super().__init__(product_name)

    def get_product_divs(self):
        # the first of _item_div_class div is not a product
        return self._soup.find_all("div", {"class": self._item_div_class})[1:]

    def get_title(self, div):
        title_div = div.find("div", {"class": self._title_div_class})
        return title_div.text if title_div else "No title"

    def get_price(self, div):
        price_div = div.find("div", {"class": self._price_div_class})
        price_span = (
            price_div.find("span", {"class": self._price_class}) if price_div else None
        )
        return price_span.text if price_span else "No price"

    def get_image_src(self, div):
        image_div = div.find("div", {"class": self._image_div_class})
        img = image_div.find("img") if image_div else None
        return img["src"] if img else "No image"

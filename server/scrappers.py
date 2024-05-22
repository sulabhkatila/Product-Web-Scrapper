import requests
from bs4 import BeautifulSoup as bs


class Scraper:
    # Base Class of all scrappers

    def __str__(self):
        return f"Scrapes ebay for products at {self._url}"

    def scrape(self, product_name, limit=None, price_less_than=None):

        html = requests.get(self._url + product_name).text
        self._soup = bs(html, "html.parser")

        product_divs = self.get_product_divs()
        res = []
        count = 0
        for div in product_divs:
            if limit and count >= limit:
                break
            title = self.get_title(div)
            link = self.get_link(div)
            price = self.get_price(div)
            image = self.get_image_src(div)
            if (
                price_less_than
                and price
                and float(price.replace("$", "")) > price_less_than
            ):
                continue
            res.append({"title": title, "link": link, "price": price, "image": image})
            count += 1
        return res


class Ebay(Scraper):

    __slots__ = [
        "_url",
        "_item_div_class",
        "_title_div_class",
        "_link_div_class",
        "_price_div_class",
        "_price_class",
        "_image_div_class",
        "_soup",
    ]

    def __init__(self):
        self._url = "https://www.ebay.com/sch/i.html?_nkw="
        self._item_div_class = "s-item__wrapper"
        self._title_div_class = "s-item__title"
        self._link_a_class = "s-item__link"
        self._price_div_class = "s-item__detail s-item__detail--primary"
        self._price_span_class = "s-item__price"
        self._image_div_class = "s-item__image-section"

    def get_product_divs(self):
        # the first of _item_div_class div is not a product
        return self._soup.find_all("div", {"class": self._item_div_class})[1:]

    def get_title(self, div):
        title_div = div.find("div", {"class": self._title_div_class})
        return title_div.text if title_div else "No title"

    def get_link(self, div):
        link_a = div.find("a", {"class": self._link_a_class})
        return link_a["href"] if link_a else "No link"

    def get_price(self, div):
        price_div = div.find("div", {"class": self._price_div_class})
        price_span = (
            price_div.find("span", {"class": self._price_span_class})
            if price_div
            else None
        )
        return price_span.text if price_span else "No price"

    def get_image_src(self, div):
        image_div = div.find("div", {"class": self._image_div_class})
        img = image_div.find("img") if image_div else None
        return img["src"] if img else "No image"

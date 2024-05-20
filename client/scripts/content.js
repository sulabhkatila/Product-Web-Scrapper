const getUrl = () => {
  const url = window.location.href;
  return url;
};

const fetchEbayData = async (url, limit = null, price = null) => {
  // ...//www.amazon.com/productname
  const productname = url.split("/")[3];

  fetchUrl = `http://localhost:4000/ebay/${productname}`;
  if (limit) {
    fetchUrl += `?limit=${limit}`;
  }
  if (price) {
    fetchUrl += `?price=${price}`;
  }

  try {
    const response = await fetch(fetchUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

const newDiv = document.createElement("div");
newDiv.style.position = "fixed";
newDiv.style.right = "0";
newDiv.style.top = "0";
newDiv.style.height = "100%";
newDiv.style.width = "300px";
newDiv.style.overflowY = "auto";
newDiv.style.display = "flex";
newDiv.style.flexDirection = "column";
newDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
newDiv.style.color = "white";
newDiv.style.zIndex = "9999";

fetchEbayData(getUrl()).then((data) => {
  data.products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.style.display = "flex";
    productDiv.style.flexDirection = "row";
    productDiv.style.padding = "10px";

    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.style.width = "100px";
    productImage.style.height = "100px";
    productDiv.appendChild(productImage);

    const productInfo = document.createElement("div");
    productInfo.style.display = "flex";
    productInfo.style.flexDirection = "column";
    productInfo.style.paddingLeft = "10px";
    productInfo.style.width = "200px";

    const productTitle = document.createElement("a");
    productTitle.href = product.link;
    productTitle.target = "_blank";
    productTitle.innerText = product.title;
    productTitle.style.color = "white";
    productInfo.appendChild(productTitle);

    const productPrice = document.createElement("div");
    productPrice.innerText = product.price;
    productPrice.style.color = "white";
    productInfo.appendChild(productPrice);

    productDiv.appendChild(productInfo);

    newDiv.appendChild(productDiv);
  });
});

document.body.appendChild(newDiv);

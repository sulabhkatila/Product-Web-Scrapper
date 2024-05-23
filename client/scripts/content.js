const EXTENSION_WIDTH = "300px";
const HEADER_DIV_HEIGHT = "140px";
const SORT_BTN_HEIGHT = "40px";
const SORT_BTN_WIDTH = "100px";

let sortMessage = "$ -> $$$";
let allProducts = [];
let sortedProducts = [];
let isSortedFromCheapest = false;

const fetchShowElement = () => {
  if (!localStorage.getItem("showElements_")) {
    localStorage.setItem("showElements_", "false");
  }
  return localStorage.getItem("showElements_") === "true";
};

const setShowElemet = (value = "true") => {
  localStorage.setItem("showElements_", value);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "displayElements") {
    newDiv.style.display = "flex";
    toggleButton.style.display = "flex";
    setShowElemet("true");
  }
  if (request.action === "hideElements") {
    newDiv.style.display = "none";
    toggleButton.style.display = "none";
    setShowElemet("false");
  }
});

const getUrl = () => {
  const url = window.location.href;
  console.log(url);
  return url;
};

const fetchEbayData = async (url, limit = null, price = null) => {
  // ...//www.amazon.com/productname/..
  // ...//www.amazon.com/s?k=productname&...
  let fetchUrl = "";
  let productname = "";
  if (url.includes("s?k=")) {
    productname = url.split("s?k=")[1].split("&")[0];
  } else {
    productname = url.split("/")[3];
  }
  fetchUrl = `http://34.30.126.151/ebay/${productname}`;

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

const displayProducts = (products) => {
  const somediv = document.getElementById("somediv");

  // empty the div
  while (somediv.firstChild) {
    somediv.removeChild(somediv.firstChild);
  }

  products.forEach((product) => {
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

    // newDiv.appendChild(productDiv);
    somediv.appendChild(productDiv);
  });
};

const sortProductsByPrice = () => {
  if (sortedProducts.length === 0) {
    sortedProducts = [...allProducts].sort((a, b) => {
      // a.price = "$100.00"
      const priceA = parseFloat(a.price.replace("$", ""));
      const priceB = parseFloat(b.price.replace("$", ""));
      return priceA - priceB;
    });
  }

  const somediv = document.getElementById("somediv");

  // empty the div
  while (somediv.firstChild) {
    somediv.removeChild(somediv.firstChild);
  }

  if (!isSortedFromCheapest) {
    displayProducts(sortedProducts);
    isSortedFromCheapest = true;
    sortMessage = "$$$ -> $";
  } else {
    displayProducts([...sortedProducts].reverse());
    isSortedFromCheapest = false;
    sortMessage = "$ -> $$$";
  }

  sortButton.innerText = sortMessage;
};

const newDiv = document.createElement("div");
newDiv.style.position = "fixed";
newDiv.style.right = "0";
newDiv.style.top = "0";
newDiv.style.height = "100%";
newDiv.style.width = EXTENSION_WIDTH;
newDiv.style.overflowY = "auto";
newDiv.style.display = fetchShowElement() ? "flex" : "none";
newDiv.style.flexDirection = "column";
newDiv.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
newDiv.style.color = "white";
newDiv.style.zIndex = "9999";

const headerDiv = document.createElement("div");
headerDiv.style.position = "fixed";
headerDiv.style.display = "flex";
headerDiv.style.justifyContent = "center";
headerDiv.style.alignItems = "center";
headerDiv.style.flexDirection = "column";
headerDiv.innerText = "THE SCRAPPER";
headerDiv.style.top = "0";
headerDiv.style.width = EXTENSION_WIDTH;
headerDiv.style.height = HEADER_DIV_HEIGHT;
headerDiv.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
headerDiv.style.color = "white";

// Option to sort by price
const sortButton = document.createElement("button");
sortButton.innerText = sortMessage;
sortButton.style.height = SORT_BTN_HEIGHT;
sortButton.style.width = SORT_BTN_WIDTH;
sortButton.style.cursor = "pointer";
sortButton.style.textAlign = "center";
sortButton.style.color = "black";
sortButton.addEventListener("click", () => {
  sortProductsByPrice();
});

const unsortButton = document.createElement("button");
unsortButton.innerText = "Unsort";
unsortButton.style.height = SORT_BTN_HEIGHT;
unsortButton.style.width = SORT_BTN_WIDTH;
unsortButton.style.textAlign = "center";
unsortButton.style.cursor = "pointer";
unsortButton.style.color = "black";
unsortButton.addEventListener("click", () => {
  displayProducts(allProducts);
  sortMessage = "$ -> $$$";
  sortButton.innerText = sortMessage;
  isSortedFromCheapest = false;
});

headerDiv.appendChild(sortButton);
headerDiv.appendChild(unsortButton);
newDiv.appendChild(headerDiv);

const somediv = document.createElement("div");
somediv.id = "somediv";
somediv.style.display = "flex";
somediv.style.flexDirection = "column";
somediv.style.marginTop = HEADER_DIV_HEIGHT;
somediv.style.height = "100%";
somediv.style.overflowY = "auto";
newDiv.appendChild(somediv);

const toggleButton = document.createElement("button");
toggleButton.innerText = "Toggle";
toggleButton.style.display = fetchShowElement() ? "flex" : "none";
toggleButton.style.position = "fixed";
toggleButton.style.right = "10px";
toggleButton.style.top = "10px";
toggleButton.style.width = "80px";
toggleButton.style.height = "40px";
toggleButton.style.zIndex = "9999";
toggleButton.addEventListener("mousedown", dragMouseDown);
toggleButton.addEventListener("click", () => {
  toggleProductDiv();
});

document.body.appendChild(toggleButton);

document.body.appendChild(newDiv);
document.body.appendChild(toggleButton);

fetchEbayData(getUrl()).then((data) => {
  allProducts = data.products;
  displayProducts(allProducts);
});

let pos1 = 0,
  pos2 = 0,
  pos3 = 0,
  pos4 = 0;
let isDragging = false;

function toggleProductDiv() {
  if (isDragging) return;
  if (newDiv.style.display === "none") {
    newDiv.style.display = "flex";
  } else {
    newDiv.style.display = "none";
  }
}

function dragMouseDown(e) {
  e.preventDefault();
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
}

function elementDrag(e) {
  e.preventDefault();
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  toggleButton.style.top = toggleButton.offsetTop - pos2 + "px";
  toggleButton.style.left = toggleButton.offsetLeft - pos1 + "px";
}

function closeDragElement() {
  document.onmouseup = null;
  document.onmousemove = null;
}

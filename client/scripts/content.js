const getUrl = () => {
  const url = window.location.href;
  console.log(url);
  return url;
};

const fetchEbayData = async (url, limit = null, price = null) => {
  // ...//www.amazon.com/productname/..
  // ...//www.amazon.com/s?k=productname&...
  let fetchUrl = "";
  if (url.includes("s?k=")) {
    const productname = url.split("s?k=")[1].split("&")[0];
    fetchUrl = `http://localhost:4000/ebay/${productname}`;
  } else {
    const productname = url.split("/")[3];
    fetchUrl = `http://localhost:4000/ebay/${productname}`;
  }

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

let sortMessage = "Cheap to Expensive";
let allProducts = [];
let sortedProducts = [];
let isSortedFromCheapest = false;

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
  console.log("Sorting products by ", sortMessage);
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
    console.log("now sorting from cheapest to expensive");
    displayProducts(sortedProducts);
    isSortedFromCheapest = true;
    sortMessage = "Expensive to Cheap";
  } else {
    console.log("now sorting from expensive to cheapest");
    displayProducts([...sortedProducts].reverse());
    isSortedFromCheapest = false;
    sortMessage = "Cheap to Expensive";
  }

  sortButton.innerText = sortMessage;
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

const headerDiv = document.createElement("div");
headerDiv.style.position = "fixed";
headerDiv.innerText = "THE SCRAPPER";
headerDiv.style.top = "0";
headerDiv.style.width = "100%";
headerDiv.style.height = "70px";
headerDiv.style.backgroundColor = "rgba(0, 0, 0, 1)";
headerDiv.style.color = "white";

// Option to sort by price
const sortButton = document.createElement("button");
sortButton.innerText = sortMessage;
sortButton.style.marginLeft = "10px";
sortButton.addEventListener("click", () => {
  // Call a function to sort the products by price
  sortProductsByPrice();
});

headerDiv.appendChild(sortButton);
newDiv.appendChild(headerDiv);

const somediv = document.createElement("div");
somediv.id = "somediv";
somediv.style.display = "flex";
somediv.style.flexDirection = "column";
somediv.style.marginTop = "50px";
somediv.style.height = "100%";
somediv.style.overflowY = "auto";
newDiv.appendChild(somediv);

const toggleButton = document.createElement("button");

toggleButton.innerText = "Toggle";
toggleButton.style.display = "flex";
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

const unsortButton = document.createElement("button");

unsortButton.innerText = "Unsort";
unsortButton.style.marginLeft = "10px";
unsortButton.addEventListener("click", () => {
  displayProducts(allProducts);
  sortMessage = "Cheap to Expensive";
  sortButton.innerText = sortMessage;
  sortedProducts = [];
  isSortedFromCheapest = false;
});

document.body.appendChild(toggleButton);

document.body.appendChild(newDiv);
document.body.appendChild(toggleButton);
headerDiv.appendChild(unsortButton);

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

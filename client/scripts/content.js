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
};

function dragMouseDown(e) {
  e.preventDefault();
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
};

function elementDrag(e) {
  e.preventDefault();
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  toggleButton.style.top = toggleButton.offsetTop - pos2 + "px";
  toggleButton.style.left = toggleButton.offsetLeft - pos1 + "px";
};

function closeDragElement() {
  document.onmouseup = null;
  document.onmousemove = null;
}

document.body.appendChild(toggleButton);

document.body.appendChild(newDiv);
document.body.appendChild(toggleButton);

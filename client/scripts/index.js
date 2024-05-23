let showElements = localStorage.getItem("showElements") === "true";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "displayElements") {
    showElements = true;
    displayElements();
  }
  if (request.action === "hideElements") {
    showElements = false;
    hideElements();
  }
});

console.log("hello");

const displayElements = () => {
  console.log("need to display");
};

const hideElements = () => {
  console.log("no");
};

document.addEventListener("DOMContentLoaded", () => {
  const switchInput = document.querySelector(".switch input");

  if (showElements) {
    switchInput.checked = true;
    displayElements();
  } else {
    switchInput.checked = false;
    hideElements();
  }

  switchInput.addEventListener("change", () => {
    if (switchInput.checked) {
      showElements = true;
      displayElements();
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "displayElements" });
      });
    } else {
      showElements = false;
      hideElements();
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "hideElements" });
      });
    }

    localStorage.setItem("showElements", showElements);
  });
});

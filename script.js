const generateBtn = document.getElementById("generateBtn");
const qrText = document.getElementById("qrText");
const qrCodeContainer = document.getElementById("qrcode");
const qrContainer = document.getElementById("qrContainer");
const downloadBtn = document.getElementById("downloadBtn");
const recentSearchesList = document.getElementById("recentSearches");

let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

generateBtn.addEventListener("click", function () {
  const text = qrText.value.trim();

  if (text === "") {
    alert("Please enter text or a URL!");
    return;
  }

  qrCodeContainer.innerHTML = "";

  const qrCode = new QRCode(qrCodeContainer, {
    text: text,
    width: 200,
    height: 200,
  });

  qrContainer.classList.add("active");
  setTimeout(() => {
    const qrCanvas = qrCodeContainer.querySelector("canvas");

    if (qrCanvas) {
      const qrDataURL = qrCanvas.toDataURL("image/png");
      downloadBtn.style.display = "inline-block";
      downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = qrDataURL;
        link.download = "qrcode.png";
        link.click();
      };

    
      saveRecentSearch(text, qrDataURL);
    }
  }, 300);
});

function saveRecentSearch(searchText, qrDataURL) {
  const newSearch = { text: searchText, qrCode: qrDataURL };

  const existingSearchIndex = recentSearches.findIndex(search => search.text === searchText);
  if (existingSearchIndex !== -1) {
    recentSearches[existingSearchIndex] = newSearch; 
  } else {
    recentSearches.unshift(newSearch); 
  }

  if (recentSearches.length > 5) {
    recentSearches = recentSearches.slice(0, 5);
  }

  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));


  updateRecentSearches();
}

function updateRecentSearches() {
  recentSearchesList.innerHTML = ""; 
  recentSearches.forEach((search, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("recent-search-item");

    const searchContent = document.createElement("div");
    searchContent.classList.add("search-content");

    const searchText = document.createElement("span");
    searchText.textContent = search.text;
    searchContent.appendChild(searchText);

    const qrThumbnail = document.createElement("img");
    qrThumbnail.src = search.qrCode;
    qrThumbnail.alt = "QR Code Thumbnail";
    qrThumbnail.classList.add("qr-thumbnail");
    searchContent.appendChild(qrThumbnail);

    listItem.onclick = () => {
      qrText.value = search.text;
      generateBtn.click();
    };


    listItem.appendChild(searchContent);
    recentSearchesList.appendChild(listItem);
  });
}

window.onload = function () {
  updateRecentSearches();
};

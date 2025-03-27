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

  // Clear the QR code container
  qrCodeContainer.innerHTML = "";

  // Generate the QR code
  const qrCode = new QRCode(qrCodeContainer, {
    text: text,
    width: 200,
    height: 200,
  });

  // Show the QR code container
  qrContainer.classList.add("active");

  // Generate download link after the QR code is rendered
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

      // Save the QR code to the recent searches list
      saveRecentSearch(text, qrDataURL);
    }
  }, 300); // Wait for the QR code to render
});

function saveRecentSearch(searchText, qrDataURL) {
  // Add the new search and the QR code image to the recent searches array
  const newSearch = { text: searchText, qrCode: qrDataURL };

  // Avoid duplicates
  const existingSearchIndex = recentSearches.findIndex(search => search.text === searchText);
  if (existingSearchIndex !== -1) {
    recentSearches[existingSearchIndex] = newSearch; // Update existing entry
  } else {
    recentSearches.unshift(newSearch); // Add to the beginning of the list
  }

  // Limit to the last 5 searches
  if (recentSearches.length > 5) {
    recentSearches = recentSearches.slice(0, 5);
  }

  // Save to localStorage
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));

  // Update the recent searches display
  updateRecentSearches();
}

function updateRecentSearches() {
  recentSearchesList.innerHTML = ""; // Clear the current list

  // Display each recent search in a list with its QR code thumbnail
  recentSearches.forEach((search, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("recent-search-item");

    // Create a container for the QR code thumbnail and search text
    const searchContent = document.createElement("div");
    searchContent.classList.add("search-content");

    // Add search text
    const searchText = document.createElement("span");
    searchText.textContent = search.text;
    searchContent.appendChild(searchText);

    // Add QR code thumbnail
    const qrThumbnail = document.createElement("img");
    qrThumbnail.src = search.qrCode;
    qrThumbnail.alt = "QR Code Thumbnail";
    qrThumbnail.classList.add("qr-thumbnail");
    searchContent.appendChild(qrThumbnail);

    // Add event listener to regenerate the QR code when clicked
    listItem.onclick = () => {
      qrText.value = search.text;
      generateBtn.click();
    };

    // Append the search content to the list item
    listItem.appendChild(searchContent);
    recentSearchesList.appendChild(listItem);
  });
}

// Load recent searches when the page is loaded
window.onload = function () {
  updateRecentSearches();
};

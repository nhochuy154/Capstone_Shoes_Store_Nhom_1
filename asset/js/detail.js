const http = axios.create({
  baseURL: "https://shop.cyberlearn.vn",
  timeout: 30000,
});

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productid");
  console.log("productId: ", productId);

  if (productId) {
    await layThongTinSanPham(productId);
  } else {
    console.error("No product ID found in URL");
  }
});

async function layThongTinSanPham(maSanPham) {
  try {
    const response = await http.get(`/api/Product/getbyid?id=${maSanPham}`);
    console.log("Product data: ", response.data.content);
    renderProductDetail(response.data.content);
  } catch (error) {
    console.error("Error fetching product info: ", error);
    // Optionally update UI to show error message
    const productContainer = document.querySelector("#product-detail");
    if (productContainer) {
      productContainer.innerHTML = `<p class="text-danger">Failed to load product details. Please try again later.</p>`;
    }
  }
}

function renderProductDetail(product) {
  // Update product title
  const productTitle = document.querySelector(".product-title");
  if (productTitle) {
    productTitle.textContent = product.name;
  }

  // Update product image
  const productImage = document.querySelector("#productImage");
  if (productImage) {
    productImage.src = product.image;
    productImage.alt = product.name;
  }

  // Update price
  const priceElement = document.querySelector(".price");
  if (priceElement) {
    priceElement.textContent = `$${product.price.toFixed(2)}`;
  }

  // Update size options
  const sizeOptions = document.querySelector(".size-options");
  if (sizeOptions && product.size) {
    sizeOptions.innerHTML = ""; // Clear existing buttons
    product.size.forEach((size, index) => {
      const button = document.createElement("button");
      button.className = `size-btn ${index === 0 ? "active" : ""}`; // Make first size active
      button.textContent = size;
      sizeOptions.appendChild(button);
    });

    // Re-attach event listeners for size buttons
    const sizeButtons = document.querySelectorAll(".size-btn");
    sizeButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        sizeButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  // Static fields (since API doesn't provide these, keep existing or set defaults)
  const vendorElement = document.querySelector(
    ".color-green-detail:nth-child(1)"
  );
  if (vendorElement) {
    vendorElement.textContent = "Havaianas";
  }

  const typeElement = document.querySelector(
    ".color-green-detail:nth-child(2)"
  );
  if (typeElement) {
    typeElement.textContent = "shoes";
  }

  const availabilityElement = document.querySelector(
    ".color-green-detail:nth-child(3)"
  );
  if (availabilityElement) {
    availabilityElement.textContent =
      product.quantity > 0 ? "In stock!" : "Out of stock";
  }

  // Update description
  const descriptionElement = document.querySelector("#productDescription");
  if (descriptionElement) {
    descriptionElement.textContent = product.description;
  }
}

// Biến toàn cục
let currentProduct = null;

// Hàm lấy thông tin sản phẩm từ API
const getProductDetail = async (productId) => {
  try {
    // Hiển thị loading
    showLoading();

    console.log("Đang tải sản phẩm với ID:", productId);

    // Gọi API
    const response = await axios.get(
      `https://shop.cyberlearn.vn/api/Product/getbyid?id=${productId}`
    );

    console.log("Response từ API:", response.data);

    // Kiểm tra response
    if (response.data.statusCode === 200 && response.data.content) {
      currentProduct = response.data.content;
      console.log("Dữ liệu sản phẩm:", currentProduct);
      renderProductDetail(currentProduct);

      // Lấy sản phẩm liên quan từ response
      if (
        currentProduct.relatedProducts &&
        currentProduct.relatedProducts.length > 0
      ) {
        console.log("Sản phẩm liên quan:", currentProduct.relatedProducts);
        renderRelatedProducts(currentProduct.relatedProducts);
      } else {
        console.log("Không có sản phẩm liên quan");
      }
    } else {
      throw new Error(response.data.message || "Không có dữ liệu sản phẩm");
    }
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    if (error.response) {
      // Lỗi từ server
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      showError(
        `Lỗi server: ${
          error.response.data.message || "Không thể tải thông tin sản phẩm"
        }`
      );
    } else if (error.request) {
      // Lỗi không có response
      console.error("Không nhận được response:", error.request);
      showError("Không thể kết nối đến server");
    } else {
      // Lỗi khác
      console.error("Lỗi:", error.message);
      showError(error.message || "Có lỗi xảy ra khi tải sản phẩm");
    }
  } finally {
    // Ẩn loading
    hideLoading();
  }
};

// Hàm viết hoa chữ cái đầu của mỗi từ
const capitalizeWords = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Hàm hiển thị thông tin sản phẩm
const renderProductDetail = (product) => {
  try {
    console.log("Bắt đầu render sản phẩm:", product);

    // Hiển thị hình ảnh
    const mainImage = document.querySelector(".product-detail__main-image img");
    if (mainImage) {
      mainImage.src = product.image;
      mainImage.alt = product.name;
    }

    // Hiển thị thông tin cơ bản
    const titleElement = document.querySelector(".product-detail__title");
    if (titleElement) titleElement.textContent = capitalizeWords(product.name);

    // Tính toán giá với giảm giá 10%
    const discountPercentage = 10;
    const originalPrice = product.price;
    const discountedPrice = originalPrice + originalPrice * 0.1;

    // Hiển thị giá
    const priceElement = document.querySelector(".product-detail__price");
    if (priceElement) {
      priceElement.innerHTML = `
                <span class="current-price">$${originalPrice}</span>
                <span class="old-price">$${discountedPrice}</span>
                <span class="discount">-${discountPercentage}%</span>
            `;
    }

    // Hiển thị shortDescription ở product-detail__description
    const descriptionElement = document.querySelector(
      ".product-detail__description p"
    );
    if (descriptionElement)
      descriptionElement.textContent = product.shortDescription;

    // Hiển thị description ở product-detail__tabs
    const descriptionTab = document.querySelector("#description");
    if (descriptionTab) {
      descriptionTab.innerHTML = `<p>${product.description}</p>`;
    }

    const skuElement = document.querySelector(
      ".product-detail__availability .sku"
    );
    if (skuElement) skuElement.textContent = `SKU: ${product.alias}`;

    // Hiển thị size options
    const sizeOptions = document.querySelector(".size-options .size-list");
    if (sizeOptions) {
      sizeOptions.innerHTML = product.size
        .map(
          (size) =>
            `<button class="size-btn" data-size="${size}">${size}</button>`
        )
        .join("");
    }

    // Hiển thị số lượng còn lại
    const stockElement = document.querySelector(
      ".product-detail__availability .stock"
    );
    if (stockElement) {
      if (product.quantity > 0) {
        stockElement.innerHTML = '<i class="fas fa-check-circle"></i> In stock';
        stockElement.classList.add("in-stock");
      } else {
        stockElement.innerHTML = '<i class="fas fa-times-circle"></i> Hết hàng';
        stockElement.classList.remove("in-stock");
      }
    }

    // Cập nhật input số lượng
    const quantityInput = document.querySelector(".quantity-selector input");
    if (quantityInput) {
      quantityInput.max = product.quantity;
      quantityInput.value = 1;
    }

    // Hiển thị categories
    const categoriesElement = document.querySelector(
      ".product-detail__categories"
    );
    if (categoriesElement) {
      console.log("Categories data:", product.categories);
      try {
        // Kiểm tra nếu categories là mảng rỗng
        if (
          Array.isArray(product.categories) &&
          product.categories.length === 0
        ) {
          categoriesElement.innerHTML = `<span><i class="fas fa-tags"></i> Categories: </span>`;
          return;
        }

        // Nếu categories là string, parse nó
        const categories =
          typeof product.categories === "string"
            ? JSON.parse(product.categories)
            : product.categories;

        console.log("Parsed categories:", categories);

        if (Array.isArray(categories) && categories.length > 0) {
          const categoriesHtml = categories
            .map((category) => `<a href="#">${category.category}</a>`)
            .join(", ");
          categoriesElement.innerHTML = `<span><i class="fas fa-tags"></i> Categories: </span>${categoriesHtml}`;
        } else {
          categoriesElement.innerHTML = `<span><i class="fas fa-tags"></i> Categories: </span>`;
        }
      } catch (error) {
        console.error("Lỗi khi parse categories:", error);
        categoriesElement.innerHTML = `<span><i class="fas fa-tags"></i> Categories: </span>`;
      }
    }

    console.log("Render sản phẩm thành công");
  } catch (error) {
    console.error("Lỗi khi render sản phẩm:", error);
    showError("Có lỗi xảy ra khi hiển thị sản phẩm");
  }
};

// Xử lý sự kiện chọn màu
const handleColorSelect = (e) => {
  const colorSwatch = e.target.closest(".color-swatch");
  if (colorSwatch) {
    // Xóa active class của tất cả các màu
    document.querySelectorAll(".color-swatch").forEach((swatch) => {
      swatch.classList.remove("active");
    });
    // Thêm active class cho màu được chọn
    colorSwatch.classList.add("active");
  }
};

// Xử lý sự kiện thêm vào giỏ hàng
const handleAddToCart = () => {
  if (!currentProduct) return;

  const selectedSize = document.querySelector(".size-btn.active");
  const selectedColor = document.querySelector(".color-swatch.active");
  const quantityInput = document.querySelector(".quantity-selector input");

  // Kiểm tra màu đã được chọn chưa
  if (!selectedColor) {
    Toastify({
      text: "Vui lòng chọn màu",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff4444, #ff0000)",
      },
    }).showToast();
    return;
  }

  // Kiểm tra size đã được chọn chưa
  if (!selectedSize) {
    Toastify({
      text: "Vui lòng chọn size",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff4444, #ff0000)",
      },
    }).showToast();
    return;
  }

  // Kiểm tra số lượng
  const quantity = parseInt(quantityInput.value);
  if (quantity < 1 || quantity > currentProduct.quantity) {
    Toastify({
      text: "Số lượng không hợp lệ",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff4444, #ff0000)",
      },
    }).showToast();
    return;
  }

  const cartItem = {
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    size: selectedSize.dataset.size,
    color: selectedColor.dataset.color,
    quantity: quantity,
    image: currentProduct.image,
  };

  // Lấy giỏ hàng từ localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingItemIndex = cart.findIndex(
    (item) =>
      item.id === cartItem.id &&
      item.size === cartItem.size &&
      item.color === cartItem.color
  );

  if (existingItemIndex >= 0) {
    // Cập nhật số lượng nếu sản phẩm đã tồn tại
    cart[existingItemIndex].quantity += cartItem.quantity;
  } else {
    // Thêm sản phẩm mới vào giỏ hàng
    cart.push(cartItem);
  }

  // Lưu giỏ hàng vào localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Hiển thị thông báo thành công
  Toastify({
    text: "Đã thêm sản phẩm vào giỏ hàng",
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
};

// Xử lý sự kiện thay đổi số lượng
const handleQuantityChange = (e) => {
  const input = e.target;
  const value = parseInt(input.value);
  const max = parseInt(input.max);

  if (value < 1) input.value = 1;
  if (value > max) input.value = max;
};

// Xử lý sự kiện tăng/giảm số lượng
const handleQuantityButton = (e) => {
  const button = e.target.closest(".quantity-btn");
  if (!button) return;

  const input = document.querySelector(".quantity-selector input");
  const currentValue = parseInt(input.value);

  if (button.classList.contains("minus")) {
    input.value = Math.max(1, currentValue - 1);
  } else if (button.classList.contains("plus")) {
    input.value = Math.min(parseInt(input.max), currentValue + 1);
  }
};

// Xử lý sự kiện wishlist
const handleWishlist = () => {
  const wishlistBtn = document.querySelector(".wishlist-btn");
  const wishlistIcon = wishlistBtn.querySelector("i");

  // Toggle class active và đổi icon
  wishlistBtn.classList.toggle("active");
  wishlistIcon.classList.toggle("far");
  wishlistIcon.classList.toggle("fas");

  // Hiển thị thông báo
  Toastify({
    text: wishlistBtn.classList.contains("active")
      ? "Đã thêm vào yêu thích"
      : "Đã xóa khỏi yêu thích",
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: wishlistBtn.classList.contains("active")
        ? "linear-gradient(to right, #00b09b, #96c93d)"
        : "linear-gradient(to right, #ff4444, #ff0000)",
    },
  }).showToast();
};

// Hiển thị loading
const showLoading = () => {
  const loading = document.createElement("div");
  loading.className = "loading-overlay";
  loading.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
  document.querySelector(".product-detail").appendChild(loading);
};

// Ẩn loading
const hideLoading = () => {
  const loading = document.querySelector(".loading-overlay");
  if (loading) {
    loading.remove();
  }
};

// Hiển thị thông báo lỗi
const showError = (message) => {
  const alert = document.createElement("div");
  alert.className = "alert alert-danger alert-dismissible fade show";
  alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
  document.querySelector(".product-detail").prepend(alert);
};

// Hiển thị thông báo thành công
const showSuccess = (message) => {
  const alert = document.createElement("div");
  alert.className = "alert alert-success alert-dismissible fade show";
  alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
  document.querySelector(".product-detail").prepend(alert);
};

// Khởi tạo trang
const initProductDetail = () => {
  // Lấy productId từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    getProductDetail(productId);
  } else {
    showError("Không tìm thấy sản phẩm");
  }

  // Thêm event listeners
  document
    .querySelector(".add-to-cart")
    .addEventListener("click", handleAddToCart);
  document
    .querySelector(".quantity-selector input")
    .addEventListener("change", handleQuantityChange);
  document
    .querySelector(".quantity-selector")
    .addEventListener("click", handleQuantityButton);
  document
    .querySelector(".wishlist-btn")
    .addEventListener("click", handleWishlist);
  document
    .querySelector(".color-swatches")
    .addEventListener("click", handleColorSelect);

  // Thêm event listener cho size buttons
  document.querySelector(".size-options").addEventListener("click", (e) => {
    const sizeBtn = e.target.closest(".size-btn");
    if (sizeBtn) {
      // Xóa active class của tất cả các nút
      document.querySelectorAll(".size-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      // Thêm active class cho nút được click
      sizeBtn.classList.add("active");
    }
  });
};

// Chạy khi DOM đã load xong
document.addEventListener("DOMContentLoaded", initProductDetail);

// Hàm định dạng giá
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const renderRelatedProducts = (products) => {
  const relatedProductsContainer = document.querySelector(
    ".related-products__grid"
  );
  if (!relatedProductsContainer) {
    console.error("Không tìm thấy container cho sản phẩm liên quan");
    return;
  }

  console.log("Dữ liệu sản phẩm liên quan:", products);

  if (!Array.isArray(products) || products.length === 0) {
    console.log("Không có sản phẩm liên quan");
    relatedProductsContainer.innerHTML = "<p>Không có sản phẩm liên quan</p>";
    return;
  }

  // Thêm class row và g-4 cho container
  relatedProductsContainer.className = "row g-4";

  let content = "";
  for (let product of products) {
    let { id, name, image, price } = product;

    content += `
            <div class="col-md-3 h-100">
                <div class="product-item">
                    <div class="product-thumb">
                        <a href="./product-detail.html?id=${id}">
                            <img src="${image}" alt="${name}" />
                        </a>
                        <div class="button-group">
                            <a href="#" data-bs-toggle="tooltip" aria-label="Add to Wishlist">
                                <i class="fa-solid fa-heart"></i>
                            </a>
                            <a href="#" class="quick-view-btn" data-id="${id}" data-bs-toggle="modal" data-bs-target="#quick_view" aria-label="Quick View">
                                <i class="fa fa-eye"></i>
                            </a>
                        </div>
                        <div class="product-label">
                            <span>new</span>
                        </div>
                        <div class="discount-label">
                            <span>-10%</span>
                        </div>
                    </div>
                    <div class="product-content">
                        <div class="product-caption">
                            <h6 class="product-name">
                                <a href="product-detail.html?id=${id}">${name}</a>
                            </h6>
                            <div class="price-box">
                                <span class="price-old">$${
                                  price + price * 0.1
                                }</span>
                                <span class="price-regular">$${price}</span>
                            </div>
                            <a class="add-to-cart" href="./product-detail.html?id=${id}">
                                <i class="fa fa-shopping-cart"></i>
                            </a>
                        </div>
                        <div class="ratings">
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  relatedProductsContainer.innerHTML = content;
};

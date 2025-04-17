document.addEventListener("DOMContentLoaded", function () {
    // Xử lý thay đổi ảnh thumbnail
    const thumbnails = document.querySelectorAll(".product-detail__thumbnails img");
    const mainImage = document.querySelector(".product-detail__main-image img");

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener("click", function () {
            mainImage.src = this.src;
            thumbnails.forEach((t) => t.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Xử lý tăng/giảm số lượng
    const minusBtn = document.querySelector(".quantity-btn.minus");
    const plusBtn = document.querySelector(".quantity-btn.plus");
    const quantityInput = document.querySelector(".quantity-selector input");

    minusBtn.addEventListener("click", function () {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    plusBtn.addEventListener("click", function () {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });

    // Xử lý chọn màu sắc
    const colorSwatches = document.querySelectorAll(".color-swatch");
    colorSwatches.forEach((swatch) => {
        swatch.addEventListener("click", function () {
            colorSwatches.forEach((s) => s.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Xử lý tabs
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const targetTab = this.dataset.tab;

            // Ẩn tất cả các tab panel
            tabPanels.forEach((panel) => panel.classList.remove("active"));

            // Bỏ active class của tất cả các nút
            tabButtons.forEach((btn) => btn.classList.remove("active"));

            // Hiển thị tab panel được chọn
            document.getElementById(targetTab).classList.add("active");

            // Thêm active class cho nút được click
            this.classList.add("active");
        });
    });

    // Xử lý nút Add to Cart
    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", function () {
        const quantity = parseInt(quantityInput.value);
        const selectedColor = document.querySelector(".color-swatch.active");
        const selectedSize = document.querySelector(".size-select").value;

        // Hiển thị thông báo hoặc thực hiện thêm vào giỏ hàng
        alert(
            `Đã thêm ${quantity} sản phẩm vào giỏ hàng\nMàu: ${
                selectedColor ? selectedColor.classList[1] : "Chưa chọn"
            }\nKích thước: ${selectedSize}`
        );
    });
});

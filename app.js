const hamMenu = document.querySelector(".hamburger-menu");
const offScreenMenu = document.querySelector(".off-screen-menu");
const container = document.querySelector("body");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
  container.classList.toggle("active");
});

const navs = document.querySelectorAll(".nav");
navs.forEach((nav) => {
  nav.addEventListener("click", function () {
    hamMenu.classList.remove("active");
    offScreenMenu.classList.remove("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cart-count");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
});

  document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".each-item");

    items.forEach((item) => {
      item.addEventListener("click", () => {
        const title = item.getAttribute("data-title");
        const price = item.getAttribute("data-price");
        const image = item.getAttribute("data-image");

        const queryParams = new URLSearchParams({
          title: title,
          price: price,
          image: image,
        });

        window.location.href = `product.html?${queryParams.toString()}`;
      });
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title");
    const price = urlParams.get("price");
    const image = urlParams.get("image");
  
    const productDetailsDiv = document.getElementById("product-details");
    const productPage = `
      <div class="prod">
        <img src="${image}" alt="" />
        <div class="first-body-product-right">
            <h1>${title}</h1>
          <div class="ratings">
            <button class="star-rate">
              <img src="images/Star icon.svg" alt="" />
              4.2 --- 54 Reviews
            </button>
            <button class="in-stock">IN STOCK</button>
          </div>
          <h1>${price}</h1>
          <p>SELECT SIZE</p>
          <div class="sizes">
            <button>S</button>
            <button>M</button>
            <button>X</button>
            <button>XL</button>
            <button>XXL</button>
          </div>
          <p>QUANTITY</p>
          <div class="quantity">
            <img src="images/Minus.svg" alt="" class="quantity-minus" />
            <h1 class="quantity-value">1</h1>
            <img src="images/Add.svg" alt="" class="quantity-add" />
          </div>
          <div class="add-to-cart">
            <button id="add-to-cart-button">Add to cart</button>
            <div class="heart">
              <img src="images/Heart icon.svg" alt="" />
            </div>
          </div>
          <p>-- FREE SHIPPING ON ORDERS $100+</p>
        </div>
      </div>
    `;
  
    productDetailsDiv.innerHTML = productPage;
  
    // Handle quantity changes
    let quantity = 1;
    const quantityMinus = document.querySelector(".quantity-minus");
    const quantityAdd = document.querySelector(".quantity-add");
    const quantityValue = document.querySelector(".quantity-value");
  
    quantityMinus.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
      }
    });
  
    quantityAdd.addEventListener("click", () => {
      quantity++;
      quantityValue.textContent = quantity;
    });
  
    // Add to cart functionality
    const addToCartButton = document.getElementById("add-to-cart-button");
    addToCartButton.addEventListener("click", () => {
      const selectedSize = document.querySelector(".sizes button.active")?.textContent || "M";
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
      // Check if item already exists in the cart
      const existingItem = cart.find(
        (item) =>
          item.title === title &&
          item.price === price &&
          item.size === selectedSize &&
          item.image === image
      );
  
      if (existingItem) {
        // If item exists, increment the quantity
        existingItem.quantity += quantity;
      } else {
        // If item does not exist, add it as a new item
        cart.push({ title, price, image, size: selectedSize, quantity });
      }
  
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "cart.html";
    });
  
    // Add active class to size buttons
    const sizeButtons = document.querySelectorAll(".sizes button");
    sizeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        sizeButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  });
    document.addEventListener('DOMContentLoaded', () => {
    const cartItemsDiv = document.getElementById('cart-items');
    const subtotalPriceSpan = document.getElementById('subtotal-price');
    const taxAmountSpan = document.getElementById('tax-amount');
    const totalPriceSpan = document.getElementById('total-price');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    let subtotal = 0;

    cart.forEach(item => {
      const price = parseFloat(item.price.replace('$', ''));
      subtotal += price * item.quantity;

      const cartItem = `
        <div class="each-cart-detail">
          <img class="thumbnails" src="${item.image}" alt="${item.title}" />
          <div class="content-name">
            <h4>${item.title}</h4>
            <p>Size: ${item.size}</p>
          </div>
          <h3>${item.price}</h3>
          <div class="quantity">
            <img src="images/Minus.svg" alt="" class="decrease-quantity" data-title="${item.title}" />
            <h1 class="quantity-value">${item.quantity}</h1>
            <img src="images/Add.svg" alt="" class="increase-quantity" data-title="${item.title}" />
          </div>
          <button class="close" data-title="${item.title}"><img src="images/close.svg" alt="" /></button>
        </div>
      `;
      cartItemsDiv.innerHTML += cartItem;
    });

    const tax = subtotal * 0.05;  // Assuming 5% tax
    const total = subtotal + tax;

    subtotalPriceSpan.innerText = `$${subtotal.toFixed(2)}`;
    taxAmountSpan.innerText = `$${tax.toFixed(2)}`;
    totalPriceSpan.innerText = `$${total.toFixed(2)}`;

    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', () => {
        updateQuantity(button.dataset.title, -1);
      });
    });

    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', () => {
        updateQuantity(button.dataset.title, 1);
      });
    });

    document.querySelectorAll('.close').forEach(button => {
      button.addEventListener('click', () => {
        removeItem(button.dataset.title);
      });
    });

    function updateQuantity(title, change) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const item = cart.find(item => item.title === title);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          removeItem(title);
        } else {
          localStorage.setItem('cart', JSON.stringify(cart));
          location.reload();
        }
      }
    }

    function removeItem(title) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item.title !== title);
      localStorage.setItem('cart', JSON.stringify(cart));
      location.reload();
    }
  });


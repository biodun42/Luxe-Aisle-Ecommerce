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
  const cartCountMobile = document.getElementById("cart-count2");

  if (cartCount && cartCountMobile) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCountMobile.textContent = totalItems;
  } else {
    console.error("Cart count elements not found");
  }
});

function loadItems() {
  let divOne = document.getElementById("third-body-homepage");
  fetch("./product.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item, index) => {
        divOne.innerHTML += `
          <div class="each-item" 
          id="${item.id}" 
          data-title="${item.title}" 
          data-price="${item.price}" 
          data-image="${item.image}">
            <img src="${item.image}" alt="${item.title}" />
            <div class="details">
              <h5>${item.title}</h5>
              <div class="each-item-price">
                <button>IN STOCK</button>
                <p>${item.price}</p>
              </div>
            </div>
          </div>
        `;
      });

      goToProductPage();
    })
    .catch((error) => console.log(error));
}

loadItems();

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
    const selectedSize =
      document.querySelector(".sizes button.active")?.textContent || "M";
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
    window.location.href = "collection.html";
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
document.addEventListener("DOMContentLoaded", () => {
  const cartItemsDiv = document.getElementById("cart-items");
  const subtotalPriceSpan = document.getElementById("subtotal-price");
  const taxAmountSpan = document.getElementById("tax-amount");
  const totalPriceSpan = document.getElementById("total-price");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let subtotal = 0;

  cart.forEach((item) => {
    const price = parseFloat(item.price.replace("$", ""));
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

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  subtotalPriceSpan.innerText = `$${subtotal.toFixed(2)}`;
  taxAmountSpan.innerText = `$${tax.toFixed(2)}`;
  totalPriceSpan.innerText = `$${total.toFixed(2)}`;

  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", () => {
      updateQuantity(button.dataset.title, -1);
    });
  });

  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", () => {
      updateQuantity(button.dataset.title, 1);
    });
  });

  document.querySelectorAll(".close").forEach((button) => {
    button.addEventListener("click", () => {
      removeItem(button.dataset.title);
    });
  });

  function updateQuantity(title, change) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find((item) => item.title === title);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        removeItem(title);
      } else {
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
      }
    }
  }

  function removeItem(title) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.title !== title);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const subtotalPriceSpan = document.getElementById("subtotal-price");
  const taxAmountSpan = document.getElementById("tax-amount");
  const totalPriceSpan = document.getElementById("total-price");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let subtotal = 0;

  cart.forEach((item) => {
    const price = parseFloat(item.price.replace("$", ""));
    subtotal += price * item.quantity;
  });

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  subtotalPriceSpan.innerText = `$${subtotal.toFixed(2)}`;
  taxAmountSpan.innerText = `$${tax.toFixed(2)}`;
  totalPriceSpan.innerText = `$${total.toFixed(2)}`;
});

function orderComplete(event) {
  event.preventDefault();
  localStorage.removeItem("cart");
  window.location.href = "afterpayment.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const checkoutButton = document.getElementById("checkout-button");
  checkoutButton.addEventListener("click", (event) => {
    event.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Your cart is empty",
      });
    } else {
      window.location.href = "checkout.html";
    }
  });
});

async function loadRandomProducts() {
  try {
    const response = await fetch("./product.json");
    const data = await response.json();

    const shuffled = data.sort(() => 0.5 - Math.random());
    const selectedProducts = shuffled.slice(0, 4);

    const productContainer = document.getElementById("similar-products");
    selectedProducts.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("each-item");
      productElement.setAttribute("data-title", product.title);
      productElement.setAttribute("data-price", product.price);
      productElement.setAttribute("data-image", product.image);

      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <div class="details">
          <h5>${product.title}</h5>
          <div class="each-item-price">
            <button>IN STOCK</button>
            <p>${product.price}</p>
          </div>
        </div>
      `;

      productContainer.appendChild(productElement);
    });

    goToProductPage();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

loadRandomProducts();

function goToProductPage() {
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
}
goToProductPage();

document.addEventListener("DOMContentLoaded", function () {
  const formTitle = document.getElementById("form-title");
  const loginForm = document.getElementById("login-form");
  const loginButton = document.getElementById("login");
  const forgotPassword = document.getElementById("forgot-password");
  const switchAccount = document.getElementById("switch-account");
  const passwordContainer = document.getElementById("password-container");

  let isLogin = true;

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password")
      ? document.getElementById("password").value
      : "";
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    let valid = true;

    if (!emailPattern.test(email)) {
      valid = false;
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Please enter a valid email address",
      });
    }

    if (isLogin && password.length < 6) {
      valid = false;
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Password must be at least 6 characters",
      });
    }

    if (valid) {
      event.target.submit();
      window.location.href = "homepage.html";
    }
  });

  function switchForm() {
    isLogin = !isLogin;
    if (isLogin) {
      formTitle.textContent = "Login";
      loginButton.textContent = "Login";
      forgotPassword.style.display = "block";
      switchAccount.innerHTML =
        'Don\'t have an account? <a href="#" id="switch-to-signup">Sign Up</a>';
      passwordContainer.style.display = "block";
    } else {
      formTitle.textContent = "Sign Up";
      loginButton.textContent = "Sign Up";
      forgotPassword.style.display = "none";
      switchAccount.innerHTML =
        'Already have an account? <a href="#" id="switch-to-signup">Login</a>';
      passwordContainer.style.display = "block";
    }
    addSwitchLinkEventListener();
  }

  function addSwitchLinkEventListener() {
    const switchLink = document.getElementById("switch-to-signup");
    switchLink.addEventListener("click", function (event) {
      event.preventDefault();
      switchForm();
    });
  }

  addSwitchLinkEventListener();
});

const signOut = document.getElementById("sign_out");
function signOutUser() {
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

const namePattern = /^[A-Z][a-z]{1,}$/;
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const phonePattern = /^09\d{9}$/;
const addressPattern = /^.{10,}$/;

const registerForm = document.getElementById("registerForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const registerSuccess = document.getElementById("registerSuccess");
const registerError = document.getElementById("registerError");

let customerData = {};
let tempCustomerData = {}; // For storing data before confirmation
let cart = [];

function validateField(field, pattern) {
  field.addEventListener("keyup", () => {
    const isValid = pattern.test(field.value);
    field.className = isValid ? "accepted" : "rejected";
  });
}

if (firstName) validateField(firstName, namePattern);
if (lastName) validateField(lastName, namePattern);
if (email) validateField(email, emailPattern);
if (phone) validateField(phone, phonePattern);
if (address) validateField(address, addressPattern);

function showRegisterForm() {
  document.getElementById("orderContent").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
}

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstNameValid = namePattern.test(firstName.value);
    const lastNameValid = namePattern.test(lastName.value);
    const emailValid = emailPattern.test(email.value);
    const phoneValid = phonePattern.test(phone.value);
    const addressValid = addressPattern.test(address.value);

    if (
      firstNameValid &&
      lastNameValid &&
      emailValid &&
      phoneValid &&
      addressValid
    ) {
      // Store in temporary object first
      tempCustomerData = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
      };

      // Show confirmation modal with the data
      document.getElementById("confirmName").textContent = 
        tempCustomerData.firstName + " " + tempCustomerData.lastName;
      document.getElementById("confirmEmail").textContent = tempCustomerData.email;
      document.getElementById("confirmPhone").textContent = tempCustomerData.phone;
      document.getElementById("confirmAddress").textContent = tempCustomerData.address;
      
      document.getElementById("infoConfirmModal").style.display = "flex";
    } else {
      registerError.style.display = "block";
      registerSuccess.style.display = "none";
    }
  });
}

function confirmInformation() {
  // Transfer temp data to actual customer data
  customerData = { ...tempCustomerData };

  // Close modal
  document.getElementById("infoConfirmModal").style.display = "none";

  // Show success message
  registerSuccess.style.display = "block";
  registerError.style.display = "none";
  registerForm.style.display = "none";

  setTimeout(() => {
    document.getElementById("registerSection").style.display = "none";
    const orderFormSection = document.getElementById("orderFormSection");
    orderFormSection.style.display = "block";
    orderFormSection.classList.add("animate__animated", "animate__fadeInUp");

    document.getElementById("displayName").textContent =
      customerData.firstName + " " + customerData.lastName;
    document.getElementById("displayEmail").textContent = customerData.email;
    document.getElementById("displayPhone").textContent = customerData.phone;
    document.getElementById("displayAddress").textContent = customerData.address;
  }, 1500);
}

function closeInfoModal() {
  document.getElementById("infoConfirmModal").style.display = "none";
  // User can edit their information
}

const orderForm = document.getElementById("orderForm");
const orderItem = document.getElementById("orderItem");
const quantity = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");
const orderSuccess = document.getElementById("orderSuccess");
const orderType = document.getElementById("orderType");

function updateTotalPrice() {
  if (!orderItem) return;

  const selectedOption = orderItem.options[orderItem.selectedIndex];
  const price = selectedOption.getAttribute("data-price");
  const qty = quantity.value;

  if (price && qty) {
    const total = price * qty;
    totalPrice.textContent = "₱" + total;
  } else {
    totalPrice.textContent = "₱0";
  }
}

if (orderItem) orderItem.addEventListener("change", updateTotalPrice);
if (quantity) quantity.addEventListener("input", updateTotalPrice);

function updateCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");
  const deliveryFeeSpan = document.getElementById("deliveryFee");

  if (cart.length === 0) {
    cartItemsDiv.innerHTML =
      '<div style="text-align:center; padding:2rem; opacity:0.5;"><p style="font-size:3rem;">🛒</p><p>Your cart is empty</p></div>';
    cartSummary.style.display = "none";
  } else {
    let cartHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      cartHTML += `
                <div class="cart-item">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity} × ₱${
        item.price
      } = ₱${itemTotal}</p>
                    ${
                      item.notes
                        ? `<p style="font-size:0.85rem; opacity:0.8; font-style:italic;">Note: ${item.notes}</p>`
                        : ""
                    }
                </div>
            `;
    });

    cartItemsDiv.innerHTML = cartHTML;

    const deliveryFee = orderType.value === "pickup" ? 0 : 50;
    deliveryFeeSpan.textContent = "₱" + deliveryFee;

    document.getElementById("cartSubtotal").textContent = "₱" + subtotal;
    document.getElementById("cartGrandTotal").textContent =
      "₱" + (subtotal + deliveryFee);
    cartSummary.style.display = "block";
  }
}

if (orderType) {
  orderType.addEventListener("change", updateCart);
}

if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedOption = orderItem.options[orderItem.selectedIndex];
    if (!selectedOption.value) return;

    const itemName = selectedOption.value;
    const itemPrice = parseInt(selectedOption.getAttribute("data-price"));
    const itemQty = parseInt(quantity.value);
    const itemNotes = document.getElementById("notes").value;

    cart.push({
      name: itemName,
      price: itemPrice,
      quantity: itemQty,
      notes: itemNotes,
    });

    updateCart();

    orderSuccess.style.display = "block";
    orderSuccess.classList.add("animate__animated", "animate__fadeIn");

    quantity.value = 1;
    document.getElementById("notes").value = "";
    orderItem.selectedIndex = 0;
    updateTotalPrice();

    setTimeout(() => {
      orderSuccess.style.display = "none";
      orderSuccess.classList.remove("animate__animated", "animate__fadeIn");
    }, 2000);
  });
}

function finalizeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty! Please add items before finalizing.");
    return;
  }

  document.getElementById("confirmModal").style.display = "flex";
  document
    .querySelector(".modal-content")
    .classList.add("animate__animated", "animate__zoomIn");
}

function confirmOrder() {
  const orderTypeValue = orderType.value === "pickup" ? "Pickup" : "Delivery";
  const deliveryFee = orderType.value === "pickup" ? 0 : 50;
  let subtotal = 0;

  let itemsHtml = "";
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    itemsHtml += `
            <li class="receipt-item-row">
                <span><strong>${item.quantity}x</strong> ${item.name}</span>
                <span>₱${itemTotal}</span>
            </li>
            ${
              item.notes
                ? `<div style="font-size:0.8rem; color:#888; margin-top:-5px; margin-bottom:8px; padding-left:10px;">Note: ${item.notes}</div>`
                : ""
            }
        `;
  });

  const grandTotal = subtotal + deliveryFee;

  const receiptHTML = `
        <div class="receipt-header">
            <span class="close-modal-x" onclick="closeSuccessModal()">&times;</span>
            
            <span class="icon">✓</span>
            <h2 style="margin:0;">Order Confirmed!</h2>
            <p style="margin:0; opacity: 0.7;">Sent to restaurant for processing</p>
        </div>
        
        <div class="receipt-body">
            <div class="receipt-details">
                <p><strong>Customer:</strong> ${customerData.firstName} ${customerData.lastName}</p>
                <p><strong>Phone:</strong> ${customerData.phone}</p>
                <p><strong>Type:</strong> ${orderTypeValue}</p>
                <p><strong>Address:</strong> ${customerData.address}</p>
            </div>

            <ul class="receipt-items-list">
                ${itemsHtml}
            </ul>

            <div class="receipt-totals">
                <div class="row"><span>Subtotal:</span> <span>₱${subtotal}</span></div>
                <div class="row"><span>Delivery Fee:</span> <span>₱${deliveryFee}</span></div>
                <div class="row grand-total"><span>TOTAL:</span> <span>₱${grandTotal}</span></div>
            </div>

            <a href="index.html"><button onclick="closeSuccessModal()" class="submit-btn" style="margin-top:1.5rem; width:100%;">OK, Back to Home</button></a>
        </div>
    `;

  document.getElementById("receiptContainer").innerHTML = receiptHTML;

  document.getElementById("confirmModal").style.display = "none";

  const successModal = document.getElementById("successModal");
  successModal.style.display = "flex";
  successModal
    .querySelector(".modal-content")
    .classList.add("animate__animated", "animate__fadeInUp");

  cart = [];
  updateCart();
}

function closeSuccessModal() {
  document.getElementById("successModal").style.display = "none";
}

function closeModal() {
  document.getElementById("confirmModal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("successModal");
  if (event.target == modal) {
    closeSuccessModal();
  }
};

const reviews = [
  {
    author: "Mukz Hadain",
    text: "ang sarap, worth it ang craving, para ako napunta ulit sa malaysia. thank you craving satisfied. ♥️♥️🇲🇾",
  },
  {
    author: "Angelo Viloria",
    text: "Absolutely phenomenal Malaysian cuisine! Rich flavors, perfect spices, stunning presentation. A must-try! 5/5 ⭐",
  },
  {
    author: "Yehn Ollodo Jumalon",
    text: "Very authentic! thanks po! Great food.",
  },
  {
    author: "Emelyn Haz Balabat",
    text: "Super naenjoy po namin at masarap lahat. Kunting sambal lang kasi super anghang hehe. Will definitely order again!",
  },
  {
    author: "Sara Yeo",
    text: "Authentic taste! Ordered 8 variants for a picnic. Packed well, superb flavors. Highly recommended! 🥰",
  },
  {
    author: "Nadine Gamalinda",
    text: "Lived 3 years in Malaysia. Didn't expect Makcik to taste this authentic. Ordering again this week!",
  },
  {
    author: "Mpn Joeshred",
    text: "Ordered Nasi Lemak Ayam via FoodPanda. Delicious and addicting! Sana bigger chicken option.",
  },
  {
    author: "Cindy PC",
    text: "I'm Malaysian. This is 95% closest to home I've tasted in PH. Get extra sambal!",
  },
  {
    author: "Geraldine Maglalang Cabello",
    text: "Great makan experience! Authentic taste and superb sambal! Sedap!! 💖",
  },
  {
    author: "Rosella Perez Antiforda-Brisenio",
    text: "Authentic Malaysian food, good presentation, affordable and fast delivery.",
  },
  {
    author: "Beth Periquet",
    text: "If you like Nasi Lemak, THIS IS IT! Will definitely order again.",
  },
  {
    author: "Antonio Ram Fernandez Roldan",
    text: "Feels like Brunei! Authentic Nasi Lemak, amazing sambal! Sobrang sarap!",
  },
  {
    author: "Sheryline Di",
    text: "Sobrang sarap ng Nasi Lemak at Sambal! Ubos agad. Will order ulit for my family 😊",
  },
  {
    author: "Roger Eliseo Ocana",
    text: "Very organic Makcik Asian food! Nilapang namin!",
  },
  {
    author: "Yormelody Fortes Ocana",
    text: "Ayos sambal! Sakto tamis-anghang. Pre-order niyo na!",
  },
  {
    author: "Daniel Thony D Elizabeth",
    text: "Authentic and delicious Nasi Lemak!",
  },
  {
    author: "Tiger Edgrr",
    text: "First time trying Malaysian food — superb Nasi Lemak Ayam and sambal!",
  },
  {
    author: "Macy Chan",
    text: "First time trying Malaysian dish. Must try for spicy lovers!",
  },
];

let currentReview = 0;
const reviewText = document.getElementById("reviewText");
const reviewAuthor = document.getElementById("reviewAuthor");
const reviewsBox = document.getElementById("reviewsBox");

function showReview(index) {
  reviewsBox.classList.remove("show");

  setTimeout(() => {
    reviewText.textContent = reviews[index].text;
    reviewAuthor.textContent = "— " + reviews[index].author;
    reviewsBox.classList.add("show");
  }, 500);
}

if (reviewsBox) {
  showReview(currentReview);
  setInterval(() => {
    currentReview = (currentReview + 1) % reviews.length;
    showReview(currentReview);
  }, 5000);
}
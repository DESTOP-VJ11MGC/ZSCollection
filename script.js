// ==================================
// ZS COLLECTION
// Created By Zubair Ali Soomro
// ==================================


// PRODUCTS DATABASE

const products = [

    {id:1, name:"Men's Fashion Shirt", category:"Men Clothing", price:2500},
    {id:2, name:"Men's Formal Suit", category:"Men Clothing", price:8500},
    {id:3, name:"Men's Jeans", category:"Men Clothing", price:3200},

    {id:4, name:"Women's Party Dress", category:"Women Clothing", price:4500},
    {id:5, name:"Women's Kurti", category:"Women Clothing", price:2800},
    {id:6, name:"Women's Fashion Suit", category:"Women Clothing", price:5500},

    {id:7, name:"Kids Fashion Dress", category:"Kids Clothing", price:1800},
    {id:8, name:"Kids Boys Suit", category:"Kids Clothing", price:2200},

    {id:9, name:"Men's Sneakers", category:"Men Shoes", price:3500},
    {id:10, name:"Men's Formal Shoes", category:"Men Shoes", price:4000},

    {id:11, name:"Women's Heels", category:"Women Shoes", price:3000},
    {id:12, name:"Women's Sneakers", category:"Women Shoes", price:3500},

    {id:13, name:"Kids Shoes", category:"Kids Shoes", price:1800},

    {id:14, name:"Makeup Kit", category:"Makeup", price:5000},
    {id:15, name:"Lipstick Collection", category:"Makeup", price:1500},
    {id:16, name:"Foundation", category:"Makeup", price:2200},

    {id:17, name:"Golden Necklace", category:"Jewellery", price:4500},
    {id:18, name:"Ladies Earrings", category:"Jewellery", price:1800},
    {id:19, name:"Fashion Bracelet", category:"Jewellery", price:1200}

];


// CART

let cart = JSON.parse(
    localStorage.getItem("zsCart")
) || [];


// LOAD PRODUCTS

function displayProducts(list = products) {

    const container =
        document.getElementById("productContainer");

    container.innerHTML = "";

    list.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        const name = document.createElement("h3");

        name.textContent = product.name;

        const category = document.createElement("p");

        category.textContent = product.category;

        const price = document.createElement("p");

        price.className = "price";

        price.textContent =
            "Rs. " + product.price.toLocaleString("en-PK");

        const button = document.createElement("button");

        button.textContent = "ADD TO CART";

        button.addEventListener("click", () => {
            addToCart(product.id);
        });

        card.append(name, category, price, button);

        container.appendChild(card);

    });

    document.getElementById("totalProducts")
    .textContent = products.length;

}


// SEARCH PRODUCTS

document.getElementById("searchProduct")
.addEventListener("input", filterProducts);


document.getElementById("categoryFilter")
.addEventListener("change", filterProducts);


function filterProducts() {

    const search = document.getElementById("searchProduct")
    .value.toLowerCase();

    const category = document.getElementById("categoryFilter")
    .value;

    const filtered = products.filter(product => {

        const matchName =
            product.name.toLowerCase().includes(search);

        const matchCategory =
            category === "All" ||
            product.category === category;

        return matchName && matchCategory;

    });

    displayProducts(filtered);

}


// ADD TO CART

function addToCart(id) {

    const product = products.find(p => p.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();

    alert(product.name + " added to your cart!");

}


// SAVE CART

function saveCart() {

    localStorage.setItem(
        "zsCart",
        JSON.stringify(cart)
    );

    displayCart();

}


// DISPLAY CART

function displayCart() {

    const container =
        document.getElementById("cartItems");

    container.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        const div = document.createElement("div");

        div.className = "cart-item";

        const info = document.createElement("span");

        info.textContent =
            item.name +
            " | Rs. " + item.price +
            " | Quantity: " + item.quantity;

        const remove = document.createElement("button");

        remove.textContent = "Remove";

        remove.addEventListener("click", () => {

            cart.splice(index, 1);

            saveCart();

        });

        div.append(info, remove);

        container.appendChild(div);

    });

    document.getElementById("cartTotal")
    .textContent = total.toLocaleString("en-PK");

    updateCheckoutTotal();

}


// GO TO CHECKOUT

function goToCheckout() {

    if (cart.length === 0) {

        alert("Please add products to your cart first!");

        return;

    }

    document.getElementById("checkout")
    .scrollIntoView({behavior:"smooth"});

}


// BILL CALCULATION

function updateCheckoutTotal() {

    let subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    let delivery = cart.length > 0 ? 200 : 0;

    document.getElementById("checkoutSubtotal")
    .textContent = subtotal.toLocaleString("en-PK");

    document.getElementById("deliveryFee")
    .textContent = delivery;

    document.getElementById("grandTotal")
    .textContent = (subtotal + delivery)
    .toLocaleString("en-PK");

}


// PLACE ORDER

document.getElementById("checkoutForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    if (cart.length === 0) {

        alert("Your shopping cart is empty!");

        return;

    }

    const name =
        document.getElementById("customerName").value.trim();

    const phone =
        document.getElementById("customerPhone").value.trim();

    const city =
        document.getElementById("customerCity").value.trim();

    const address =
        document.getElementById("customerAddress").value.trim();

    const payment =
        document.getElementById("paymentMethod").value;


    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const delivery = 200;

    const total = subtotal + delivery;


    // CUSTOMER ORDER RECORD

    const order = {

        orderID: "ZS-" + Date.now(),

        customerName: name,

        phone: phone,

        city: city,

        address: address,

        products: cart.map(item => ({...item})),

        subtotal: subtotal,

        delivery: delivery,

        total: total,

        paymentMethod: payment,

        paymentStatus:
            payment === "Cash on Delivery"
            ? "Pay on Delivery"
            : "Pending - Payment Gateway Required",

        orderStatus: "New Order",

        orderDate: new Date().toLocaleString()

    };


    // SAVE ORDER

    let orders = JSON.parse(
        localStorage.getItem("zsOrders")
    ) || [];

    orders.push(order);

    localStorage.setItem(
        "zsOrders",
        JSON.stringify(orders)
    );


    // EMPTY CART

    cart = [];

    localStorage.setItem(
        "zsCart",
        JSON.stringify(cart)
    );


    // UPDATE WEBSITE

    displayCart();

    displayOrders();

    updateStatistics();


    // CONFIRMATION

    document.getElementById("orderMessage")
    .textContent =
        "Order Successfully Placed! Order ID: " +
        order.orderID;


    alert(
        "WELCOME TO ZS COLLECTION!\n\n" +

        "Customer: " + name +

        "\nCity: " + city +

        "\nOrder ID: " + order.orderID +

        "\nPayment: " + payment +

        "\nTotal: Rs. " + total
    );


    this.reset();

});


// DISPLAY ALL ORDERS

function displayOrders() {

    const container =
        document.getElementById("orderRecords");

    container.innerHTML = "";

    let orders = JSON.parse(
        localStorage.getItem("zsOrders")
    ) || [];


    orders.forEach(order => {

        const card = document.createElement("div");

        card.className = "order-card";

        const heading = document.createElement("h3");

        heading.textContent =
            "Order ID: " + order.orderID;

        const customer = document.createElement("p");

        customer.textContent =
            "Customer: " + order.customerName;

        const phone = document.createElement("p");

        phone.textContent =
            "Phone: " + order.phone;

        const location = document.createElement("p");

        location.textContent =
            "Location: " + order.city +
            " - " + order.address;

        const items = document.createElement("p");

        items.textContent = "Products: " +
            order.products.map(item =>
                item.name + " x " + item.quantity
            ).join(", ");

        const payment = document.createElement("p");

        payment.textContent =
            "Payment Method: " + order.paymentMethod;

        const paymentStatus = document.createElement("p");

        paymentStatus.textContent =
            "Payment Status: " + order.paymentStatus;

        const total = document.createElement("h3");

        total.textContent =
            "Total Bill: Rs. " +
            order.total.toLocaleString("en-PK");

        const date = document.createElement("p");

        date.textContent = "Date: " + order.orderDate;

        card.append(
            heading,
            customer,
            phone,
            location,
            items,
            payment,
            paymentStatus,
            total,
            date
        );

        container.appendChild(card);

    });

}


// SALON BOOKING

document.getElementById("bookingForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const booking = {

        name: document.getElementById("bookingName").value,

        phone: document.getElementById("bookingPhone").value,

        salon: document.getElementById("salonType").value,

        service: document.getElementById("salonService").value,

        date: document.getElementById("bookingDate").value

    };


    let bookings = JSON.parse(
        localStorage.getItem("zsBookings")
    ) || [];

    bookings.push(booking);

    localStorage.setItem(
        "zsBookings",
        JSON.stringify(bookings)
    );

    alert(
        "Appointment Booked Successfully!\n" +
        "Customer: " + booking.name +
        "\nSalon: " + booking.salon +
        "\nService: " + booking.service
    );

    this.reset();

    displayBookings();

    updateStatistics();

});


// DISPLAY SALON BOOKINGS

function displayBookings() {

    const container =
        document.getElementById("bookingRecords");

    container.innerHTML = "";

    let bookings = JSON.parse(
        localStorage.getItem("zsBookings")
    ) || [];

    bookings.forEach(booking => {

        const card = document.createElement("div");

        card.className = "order-card";

        const details = document.createElement("p");

        details.textContent =
            booking.name +
            " | " + booking.phone +
            " | " + booking.salon +
            " | " + booking.service +
            " | " + booking.date;

        card.appendChild(details);

        container.appendChild(card);

    });

}


// STATISTICS

function updateStatistics() {

    const orders = JSON.parse(
        localStorage.getItem("zsOrders")
    ) || [];

    const bookings = JSON.parse(
        localStorage.getItem("zsBookings")
    ) || [];

    document.getElementById("totalOrders")
    .textContent = orders.length;

    document.getElementById("totalBookings")
    .textContent = bookings.length;

}


// INITIAL WEBSITE LOAD

displayProducts();

displayCart();

displayOrders();

displayBookings();

updateStatistics();
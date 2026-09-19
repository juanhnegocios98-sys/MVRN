const products = [

  {
    id: 1,
    name: "Essential Black",
    price: 83900,
    img: "image2.jpeg"
  },

  {
    id: 2,
    name: "Essential White",
    price: 78000,
    img: "image3.png"
  },

  {
    id: 3,
    name: "001",
    price: 91900,
    img: "image4.png"
  },

  {
    id: 4,
    name: "MVRN",
    price: 101900,
    img: "image5.jpeg"
  },

  {
    id: 5,
    name: "MOCHA",
    price: 98900,
    img: "image6.jpeg"
  },

  {
    id: 6,
    name: "AZURE",
    price: 98000,
    img: "image7.jpeg"
  },

  {
    id: 7,
    name: "Nueva camiseta",
    price: 87900,
    img: "image8.jpeg"
  }

];


const sizes = ["S", "M", "L", "XL"];

let cart = JSON.parse(
  localStorage.getItem("mavrenCart") || "[]"
);


// FORMATO DE DINERO
const money = (number) => {

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(number);

};


// ELEMENTOS
const productsEl = document.getElementById("products");

const cartEl = document.getElementById("cart");

const overlay = document.getElementById("overlay");

const cartItemsEl = document.getElementById("cartItems");

const cartCountEl = document.getElementById("cartCount");

const cartTotalEl = document.getElementById("cartTotal");


// CREAR PRODUCTOS
products.forEach((product) => {

  const card = document.createElement("article");

  card.className = "product";


  card.innerHTML = `

    <div class="product-img">

      <img
        src="${product.img}"
        alt="${product.name}"
        loading="lazy"
      >

      <div class="product-number">
        0${product.id}
      </div>

    </div>


    <div class="product-info">

      <h3>${product.name}</h3>

      <span class="price">
        ${money(product.price)}
      </span>

    </div>


    <div class="size-title">
      TALLA
    </div>


    <div class="size-row">

      ${sizes.map((size, index) => `

        <button
          class="size ${index === 1 ? "active" : ""}"
          data-size="${size}"
        >
          ${size}
        </button>

      `).join("")}

    </div>


    <button class="add">
      AÑADIR AL CARRITO
    </button>

  `;


  let selectedSize = "M";


  // TALLAS
  card.querySelectorAll(".size").forEach((button) => {

    button.addEventListener("click", () => {

      selectedSize = button.dataset.size;


      card
        .querySelectorAll(".size")
        .forEach((item) => {
          item.classList.remove("active");
        });


      button.classList.add("active");

    });

  });


  // AGREGAR AL CARRITO
  card.querySelector(".add").addEventListener("click", () => {

    const existing = cart.find(
      item =>
        item.id === product.id &&
        item.size === selectedSize
    );


    if (existing) {

      existing.qty += 1;

    } else {

      cart.push({
        id: product.id,
        size: selectedSize,
        qty: 1
      });

    }


    saveCart();

    openCart();

  });


  productsEl.appendChild(card);

});


// GUARDAR CARRITO
function saveCart() {

  localStorage.setItem(
    "mavrenCart",
    JSON.stringify(cart)
  );

  renderCart();

}


// RENDERIZAR CARRITO
function renderCart() {

  const count = cart.reduce(
    (total, item) => total + item.qty,
    0
  );


  const total = cart.reduce(
    (total, item) => {

      const product = products.find(
        product => product.id === item.id
      );

      return total + product.price * item.qty;

    },
    0
  );


  cartCountEl.textContent = count;

  cartTotalEl.textContent = money(total);


  if (!cart.length) {

    cartItemsEl.innerHTML = `
      <div class="empty">
        Tu carrito está vacío.
      </div>
    `;

    return;

  }


  cartItemsEl.innerHTML = cart.map(
    (item, index) => {

      const product = products.find(
        product => product.id === item.id
      );


      return `

        <div class="cart-item">

          <div class="cart-product">

            <img
              src="${product.img}"
              alt="${product.name}"
            >

            <div>

              <strong>
                ${product.name}
              </strong>

              <small>
                Talla ${item.size}
              </small>

              <small>
                ${money(product.price)}
              </small>


              <div class="qty">

                <button
                  onclick="changeQty(${index}, -1)"
                >
                  −
                </button>

                <span>
                  ${item.qty}
                </span>

                <button
                  onclick="changeQty(${index}, 1)"
                >
                  +
                </button>

              </div>

            </div>

          </div>


          <button
            class="remove"
            onclick="removeItem(${index})"
          >
            ELIMINAR
          </button>

        </div>

      `;

    }
  ).join("");

}


// CAMBIAR CANTIDAD
function changeQty(index, difference) {

  cart[index].qty += difference;


  if (cart[index].qty <= 0) {

    cart.splice(index, 1);

  }


  saveCart();

}


// ELIMINAR PRODUCTO
function removeItem(index) {

  cart.splice(index, 1);

  saveCart();

}


// ABRIR CARRITO
function openCart() {

  cartEl.classList.add("show");

  overlay.classList.add("show");

  document.body.classList.add("cart-open");

}


// CERRAR CARRITO
function closeCart() {

  cartEl.classList.remove("show");

  overlay.classList.remove("show");

  document.body.classList.remove("cart-open");

}


// BOTONES
document
  .getElementById("openCart")
  .addEventListener("click", openCart);


document
  .getElementById("closeCart")
  .addEventListener("click", closeCart);


overlay.addEventListener(
  "click",
  closeCart
);


// ESC PARA CERRAR
document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeCart();
    }

  }
);


// CHECKOUT WHATSAPP
document
  .getElementById("checkout")
  .addEventListener("click", () => {


    if (!cart.length) {

      alert("Tu carrito está vacío.");

      return;

    }


    const total = cart.reduce(
      (sum, item) => {

        const product = products.find(
          product => product.id === item.id
        );

        return sum + product.price * item.qty;

      },
      0
    );


    const lines = cart.map(
      item => {

        const product = products.find(
          product => product.id === item.id
        );


        return (
          `${product.name} | ` +
          `Talla ${item.size} | ` +
          `Cantidad ${item.qty} | ` +
          `${money(product.price * item.qty)}`
        );

      }
    ).join("\n");


    const message = `

Hola MAVREN,

Quiero realizar este pedido:

${lines}

TOTAL: ${money(total)}

Ciudad:
Dirección:

Método de pago:

Nombre:

Número de contacto:

Gracias.

    `.trim();


    const whatsappURL =
      "https://wa.me/573150472837?text=" +
      encodeURIComponent(message);


    window.open(
      whatsappURL,
      "_blank"
    );

  });


// INICIAR
renderCart();

const products=[
 {id:1,name:"Essential Black",price:83900,img:"image2.jpeg"},
 {id:2,name:"Essential White",price:78000,img:"image3.png"},
 {id:3,name:"001",price:91900,img:"image4.png"},
 {id:4,name:"MVRN",price:101900,img:"image5.jpeg"},
 {id:5,name:"MOCHA",price:98900,img:"image6.jpeg"},
 {id:6,name:"AZURE",price:98000,img:"image7.jpeg"},
 {id:7,name:"Nueva camiseta",price:87900,img:"image8.jpeg"}
];
const sizes=["S","M","L","XL"]; let cart=JSON.parse(localStorage.getItem("mavrenCart")||"[]");
const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
const productsEl=document.getElementById("products");
products.forEach(p=>{
 const card=document.createElement("article"); card.className="product";
 card.innerHTML=`<div class="product-img"><img src="assets/${p.img}" alt="${p.name}"></div><div class="product-info"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div><div class="size-row">${sizes.map(s=>`<button class="size" data-size="${s}">${s}</button>`).join("")}</div><button class="add">AÑADIR AL CARRITO</button>`;
 let selected="M"; card.querySelectorAll(".size").forEach((b,i)=>{if(i===1)b.classList.add("active");b.onclick=()=>{selected=b.dataset.size;card.querySelectorAll(".size").forEach(x=>x.classList.remove("active"));b.classList.add("active")}}); 
 card.querySelector(".add").onclick=()=>{const found=cart.find(x=>x.id===p.id&&x.size===selected);if(found)found.qty++;else cart.push({id:p.id,size:selected,qty:1});save();openCart()};
 productsEl.appendChild(card);
});
function save(){localStorage.setItem("mavrenCart",JSON.stringify(cart));renderCart()}
function renderCart(){
 const el=document.getElementById("cartItems"), count=cart.reduce((a,x)=>a+x.qty,0), total=cart.reduce((a,x)=>{let p=products.find(p=>p.id===x.id);return a+p.price*x.qty},0);
 document.getElementById("cartCount").textContent=count;document.getElementById("cartTotal").textContent=money(total);
 if(!cart.length){el.innerHTML='<div class="empty">Tu carrito está vacío.</div>';return}
 el.innerHTML=cart.map((x,i)=>{let p=products.find(p=>p.id===x.id);return `<div class="cart-item"><div><strong>${p.name}</strong><br><small>Talla ${x.size} · ${money(p.price)}</small><div class="qty"><button onclick="changeQty(${i},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${i},1)">+</button></div></div><button class="remove" onclick="removeItem(${i})">ELIMINAR</button></div>`}).join("")
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);save()}
function removeItem(i){cart.splice(i,1);save()}
const cartEl=document.getElementById("cart"),overlay=document.getElementById("overlay");
function openCart(){cartEl.classList.add("show");overlay.classList.add("show")}
function closeCart(){cartEl.classList.remove("show");overlay.classList.remove("show")}
document.getElementById("openCart").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;overlay.onclick=closeCart;
document.getElementById("checkout").onclick=()=>{
 if(!cart.length){alert("Tu carrito está vacío.");return}
 const total=cart.reduce((a,x)=>a+products.find(p=>p.id===x.id).price*x.qty,0);
 const lines=cart.map(x=>{let p=products.find(p=>p.id===x.id);return `• ${p.name} | Talla ${x.size} | Cant. ${x.qty} | ${money(p.price*x.qty)}`}).join("\n");
 const msg=`Hola MAVREN, quiero hacer este pedido:\n\n${lines}\n\nTOTAL: ${money(total)}\n\nCiudad: \nDirección: \nMétodo de pago: \n\nEl envío depende de la ciudad.`;
 window.open("https://wa.me/573150472837?text="+encodeURIComponent(msg),"_blank");
};
renderCart();
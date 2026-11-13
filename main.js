/* 1. SELECCIÓN DE ELEMENTOS DEL DOM */
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartBar = document.getElementById('cart-bar');

const cartItemsContainer = document.getElementById('cart-items-container');
const cartCountBadge = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartTotalPreview = document.getElementById('cart-total-preview');
const barCount = document.getElementById('bar-count');
const barTotal = document.getElementById('bar-total');

const addButtons = document.querySelectorAll('.btn-add');

/* 2. ABRIR Y CERRAR EL CARRITO */
function openCart() {
    cartDrawer.classList.remove('hidden');
    cartOverlay.classList.add('open');
}

function closeCart() {
    cartDrawer.classList.add('hidden');
    cartOverlay.classList.remove('open');
}

cartToggleBtn.addEventListener('click', openCart);
cartBar.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
});

/* 3. LÓGICA DEL CARRITO */
let cart = [];

function updateCartUI() {
    cartItemsContainer.innerHTML = '';

    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu pedido está vacío. ¡Elige algo rico!</p>';
    } else {
        cart.forEach((item, index) => {
            totalItems += 1;
            totalPrice += item.price;

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <span>$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${index})">Quitar</button>
                </div>
            `;
        });
    }

    cartCountBadge.textContent = totalItems;
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    cartTotalPreview.textContent = `$${totalPrice.toFixed(0)}`;
    barCount.textContent = totalItems;
    barTotal.textContent = `$${totalPrice.toFixed(0)}`;

    // La barra inferior solo se ve cuando hay algo en el pedido
    cartBar.classList.toggle('show', totalItems > 0);
}

function bump(element) {
    element.classList.remove('bump');
    void element.offsetWidth;          // reinicia la animación
    element.classList.add('bump');
}

function addToCart(event) {
    const button = event.target;
    const productName = button.getAttribute('data-name');
    const productPrice = parseFloat(button.getAttribute('data-price'));

    cart.push({ name: productName, price: productPrice });
    updateCartUI();
    bump(cartToggleBtn);
    bump(cartBar);

    const originalText = button.textContent;
    button.textContent = '¡Agregado!';
    button.style.backgroundColor = '#10b981';
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 1000);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

addButtons.forEach(button => button.addEventListener('click', addToCart));

/* 4. PEDIR POR WHATSAPP */
const WHATSAPP_NUMBER = '525549318319'; // ⚠️ DEMO: cambia por el número del negocio

document.querySelector('.btn-checkout').addEventListener('click', () => {
    if (cart.length === 0) return;
    const lines = cart.map(item => `• ${item.name} - $${item.price}`);
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const message = `Hola, quiero hacer un pedido:\n${lines.join('\n')}\nTotal: $${total}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

/* 5. ¿ABIERTO O CERRADO? (horario de Google Maps: 12:00 a 22:00, confirmar con el negocio) */
function updateOpenStatus() {
    const chip = document.getElementById('open-status');
    const hour = new Date().getHours();
    const isOpen = hour >= 12 && hour < 22;
    chip.textContent = isOpen ? 'Abierto ahora · cierra a las 10 p. m.' : 'Cerrado · abre a las 12:00 p. m.';
    chip.classList.toggle('is-open', isOpen);
}

/* 6. SI UNA IMAGEN NO CARGA, SE QUITA Y QUEDA EL FONDO */
document.querySelectorAll('.product-img, .logo').forEach(img => {
    img.addEventListener('error', () => img.remove());
});

/* 7. FOOTER: WHATSAPP PARA ENCARGOS Y MODAL DEL MAPA */
const eventMessage = 'Hola, quiero información para encargar para recoger o para festejar un cumpleaños.';
document.getElementById('footer-whatsapp').href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(eventMessage)}`;

const mapDialog = document.getElementById('map-dialog');
const mapFrame = document.getElementById('map-frame');
const MAP_SRC = 'https://www.google.com/maps?q=19.6708521,-99.075407&z=17&output=embed';

document.getElementById('open-map-btn').addEventListener('click', () => {
    if (!mapFrame.getAttribute('src')) mapFrame.src = MAP_SRC;   // el mapa se carga solo al abrir
    mapDialog.showModal();
});
document.getElementById('close-map-btn').addEventListener('click', () => mapDialog.close());
mapDialog.addEventListener('click', (e) => {
    if (e.target === mapDialog) mapDialog.close();               // clic fuera = cerrar
});

updateOpenStatus();
updateCartUI();
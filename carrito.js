
document.addEventListener('DOMContentLoaded', () => {
  // Obtener elementos
  const btnVerCarrito = document.getElementById('btn-ver-carrito');
  const modalCarrito = document.getElementById('modal-carrito');
  const cerrarCarrito = document.getElementById('cerrar-carrito');
  const productosCarritoDiv = document.getElementById('productos-carrito');
  const totalCarritoSpan = document.getElementById('total-carrito');
  const contadorCarrito = document.getElementById('contador-carrito');
  const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
  const finalizarCompraBtn = document.getElementById('finalizarCompraBtn');
if (finalizarCompraBtn) {
  finalizarCompraBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    guardarCarrito();
    window.location.href = "envio.html";
  });
}


  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  function actualizarContador() {
    contadorCarrito.textContent = carrito.length;
  }

  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function mostrarCarrito() {
    productosCarritoDiv.innerHTML = '';
    if (carrito.length === 0) {
      productosCarritoDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
      totalCarritoSpan.textContent = '0';
      return;
    }

    let total = 0;
    carrito.forEach((producto, index) => {
      total += producto.precio;
      const div = document.createElement('div');
      div.style.borderBottom = '1px solid #ccc';
      div.style.marginBottom = '10px';
      div.style.paddingBottom = '10px';

      div.innerHTML = `
        <p><strong>${producto.nombre}</strong></p>
        <p>Precio: $${producto.precio}</p>
        <button data-index="${index}" class="btn-eliminar" style="background:#c00; color:#fff; border:none; padding:5px; border-radius:3px; cursor:pointer;">Eliminar</button>
      `;
      productosCarritoDiv.appendChild(div);
    });

    totalCarritoSpan.textContent = total;

    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(boton => {
      boton.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        carrito.splice(idx, 1);
        guardarCarrito();
        actualizarContador();
        mostrarCarrito();
      });
    });
  }

  if (btnVerCarrito) {
    btnVerCarrito.addEventListener('click', () => {
      mostrarCarrito();
      modalCarrito.style.display = 'flex';
    });
  }

  if (cerrarCarrito) {
    cerrarCarrito.addEventListener('click', () => {
      modalCarrito.style.display = 'none';
    });
  }

  if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener('click', () => {
      carrito = [];
      guardarCarrito();
      actualizarContador();
      mostrarCarrito();
    });
  }

  if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener('click', () => {
      if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de continuar.");
        return;
      }
      // Guardamos carrito y vamos a página de envío
      guardarCarrito();
      window.location.href = "envio.html";
    });
  }

  function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    guardarCarrito();
    actualizarContador();
    alert(`Agregaste "${nombre}" al carrito.`);
  }

  actualizarContador();

  document.querySelectorAll('.producto button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productoDiv = e.target.closest('.producto');
      const nombre = productoDiv.querySelector('h3').textContent;
      const precioTexto = productoDiv.querySelector('p').textContent;
      const precio = parseFloat(precioTexto.replace('$', '').replace(',', '.'));
      agregarAlCarrito(nombre, precio);
    });
  });
});

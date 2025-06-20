document.addEventListener('DOMContentLoaded', () => {
  const btnVerCarrito = document.getElementById('btn-ver-carrito');
  const modalCarrito = document.getElementById('modal-carrito');
  const cerrarCarrito = document.getElementById('cerrar-carrito');
  const productosCarritoDiv = document.getElementById('productos-carrito');
  const totalCarritoSpan = document.getElementById('total-carrito');
  const contadorCarrito = document.getElementById('contador-carrito');
  const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
  const finalizarCompraBtn = document.getElementById('finalizarCompraBtn');

  // Cargar carrito desde localStorage
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Normalizar carrito viejo (asegura cantidad y precioUnitario válidos)
  carrito = carrito.map(p => ({
    ...p,
    cantidad: Number(p.cantidad) || 1,
    precioUnitario: Number(p.precioUnitario) || Number(p.precio) || 0
  }));

  function actualizarContador() {
    const totalItems = carrito.reduce((acc, prod) => acc + (Number(prod.cantidad) || 0), 0);
    contadorCarrito.textContent = isNaN(totalItems) ? 0 : totalItems;
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
      const subtotal = producto.precioUnitario * producto.cantidad;
      total += subtotal;

      const div = document.createElement('div');
      div.style.borderBottom = '1px solid #ccc';
      div.style.marginBottom = '10px';
      div.style.paddingBottom = '10px';

      div.innerHTML = `
        <p><strong>${producto.nombre}</strong></p>
        <p>Cantidad: ${producto.cantidad}</p>
        <p>Precio unitario: $${producto.precioUnitario.toFixed(2)}</p>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <button data-index="${index}" class="btn-eliminar" style="background:#c00; color:#fff; border:none; padding:5px; border-radius:3px; cursor:pointer;">Eliminar</button>
      `;
      productosCarritoDiv.appendChild(div);
    });

    totalCarritoSpan.textContent = total.toFixed(2);

    // Botones para eliminar productos
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
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
        mostrarMensaje("El carrito está vacío. Agregá productos antes de continuar.");
        return;
      }
      guardarCarrito();
      window.location.href = "envio.html";
    });
  }

  function agregarAlCarrito(producto) {
    const existente = carrito.find(p => p.nombre === producto.nombre && p.precioUnitario === producto.precioUnitario);
    if (existente) {
      existente.cantidad += producto.cantidad;
    } else {
      carrito.push(producto);
    }
    guardarCarrito();
    actualizarContador();
    mostrarMensaje(`Agregaste "${producto.nombre}" x${producto.cantidad} al carrito ✅`);
  }

  function mostrarMensaje(texto) {
    const aviso = document.createElement('div');
    aviso.textContent = texto;
    aviso.style.position = 'fixed';
    aviso.style.top = '20px';
    aviso.style.right = '20px';
    aviso.style.background = '#4caf50';
    aviso.style.color = '#fff';
    aviso.style.padding = '12px 20px';
    aviso.style.borderRadius = '6px';
    aviso.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    aviso.style.zIndex = '9999';
    aviso.style.fontWeight = 'bold';
    document.body.appendChild(aviso);
    setTimeout(() => aviso.remove(), 3000);
  }

  actualizarContador();

  // Productos normales (clase .producto)
  document.querySelectorAll('.producto button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productoDiv = e.target.closest('.producto');
      const nombre = productoDiv.querySelector('h3').textContent;
      const precioTexto = productoDiv.querySelector('p').textContent;
      const precioUnitario = parseFloat(precioTexto.replace('$', '').replace(',', '.'));
      if (isNaN(precioUnitario)) {
        mostrarMensaje('Precio inválido para ' + nombre);
        return;
      }
      agregarAlCarrito({ nombre, cantidad: 1, precioUnitario });
    });
  });

  // Ofertas (clase .oferta-item con data-precio y data-cantidad)
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => {
      const oferta = btn.closest('.oferta-item');
      const nombre = oferta.querySelector('h3').textContent;
      const cantidad = Number(oferta.dataset.cantidad) || 1;
      const precioTotal = Number(oferta.dataset.precio);

      if (isNaN(precioTotal) || precioTotal <= 0) {
        mostrarMensaje('Precio inválido para ' + nombre);
        return;
      }

      const precioUnitario = precioTotal / cantidad;
      agregarAlCarrito({ nombre, cantidad, precioUnitario });
    });
  });
});

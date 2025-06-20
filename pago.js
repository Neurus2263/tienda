document.addEventListener("DOMContentLoaded", () => {
  const formPago = document.getElementById("formPago");
  const detallePedido = document.getElementById("detallePedido");
  const montoTotal = document.getElementById("montoTotal");
  const modalExito = document.getElementById("modal-exito");
  const volverInicioBtn = document.getElementById("volverInicioBtn");

  modalExito?.classList.remove("mostrar");

  const datosCompra = JSON.parse(localStorage.getItem("datosCompra")) || {
    carrito: [],
    tipoEnvio: "retiro",
    costoEnvio: 0,
    totalFinal: 0
  };

  datosCompra.carrito.forEach(producto => {
    const cantidad = producto.cantidad || 1;
    const precioUnitario = parseFloat(producto.precioUnitario) || 0;
    const subtotal = precioUnitario * cantidad;

    const p = document.createElement("p");
    p.textContent = `${producto.nombre} x${cantidad} - $${subtotal.toFixed(2)}`;
    detallePedido.appendChild(p);
  });

  const envio = document.createElement("p");
  envio.textContent = `Envío: ${datosCompra.tipoEnvio === "envio" ? "$" + datosCompra.costoEnvio : "Gratis"}`;
  detallePedido.appendChild(envio);

  montoTotal.textContent = `Total a pagar: $${(datosCompra.totalFinal || 0).toFixed(2)}`;

  formPago.addEventListener("submit", e => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const metodo = document.getElementById("metodo").value;

    if (!nombre || !metodo) {
      alert("Completá todos los datos para finalizar la compra.");
      return;
    }

    if (metodo === "mercado-pago") {
      window.location.href = "https://www.mercadopago.com.ar/";
      return;
    }

    if (modalExito && nombre && metodo) {
      modalExito.classList.add("mostrar");
    }

    localStorage.removeItem("carrito");
    localStorage.removeItem("datosCompra");
  });

  volverInicioBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

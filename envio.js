const resumen = document.getElementById("resumenCarrito");
const totalFinal = document.getElementById("totalFinal");
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let total = 0;

carrito.forEach(item => {
  const p = document.createElement("p");
  p.textContent = `${item.nombre} x${item.cantidad || 1} - $${item.precio * (item.cantidad || 1)}`;
  resumen.appendChild(p);
  total += item.precio * (item.cantidad || 1);
});

function calcularTotalConEnvio() {
  const tipoEnvio = document.querySelector('input[name="tipoEnvio"]:checked').value;
  const costoEnvio = tipoEnvio === "envio" ? 1500 : 0;
  const totalConEnvio = total + costoEnvio;
  totalFinal.textContent = `Total con ${tipoEnvio === "envio" ? "envío" : "retiro"}: $${totalConEnvio}`;

  const datosFinales = {
    carrito: carrito,
    tipoEnvio: tipoEnvio,
    costoEnvio: costoEnvio,
    totalFinal: totalConEnvio
  };

  localStorage.setItem("datosCompra", JSON.stringify(datosFinales));
}

document.querySelectorAll('input[name="tipoEnvio"]').forEach(radio => {
  radio.addEventListener("change", calcularTotalConEnvio);
});

document.getElementById("continuarPagoBtn").addEventListener("click", () => {
  calcularTotalConEnvio();
  window.location.href = "pago.html";
});

// Calcular al cargar
calcularTotalConEnvio();

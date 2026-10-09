const socket = io();
const form = document.querySelector("#service-form");
const list = document.querySelector("#services-list");
const errorBox = document.querySelector("#form-error");

const specialtyLabels = Object.fromEntries(
  [...form.elements.specialty.options].map((option) => [option.value, option.textContent])
);

const escapeHtml = (text = "") =>
  String(text).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const renderServices = (services) => {
  list.innerHTML = services
    .map(
      (service) => `
        <li class="card" data-id="${service.id || service._id}">
          <p class="meta">${escapeHtml(specialtyLabels[service.specialty] ?? service.specialty)}</p>
          <h2>${escapeHtml(service.title)}</h2>
          <p>${escapeHtml(service.description)}</p>
          <p class="price">$${service.price}</p>
          <span class="badge ${service.status ? "ok" : "no"}">
            ${service.status ? "Disponible" : "No disponible"}
          </span>
        </li>
      `
    )
    .join("");
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorBox.hidden = true;

  const data = Object.fromEntries(new FormData(form));
  data.price = Number(data.price);
  data.status = true;

  socket.emit("createService", data);
  form.reset();
  form.elements.price.value = 20000;
});

socket.on("servicesUpdated", (services) => {
  renderServices(services);
});

socket.on("serviceError", ({ message }) => {
  errorBox.hidden = false;
  errorBox.textContent = message;
});

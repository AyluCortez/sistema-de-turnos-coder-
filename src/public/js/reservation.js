const form = document.querySelector("#reservation-form");
const message = document.querySelector("#reservation-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.hidden = true;
  message.classList.add("error");

  const formData = new FormData(form);

  const data = {
    clientName: formData.get("clientName"),
    date: new Date(`${formData.get("date")}T${formData.get("time")}`).toISOString(),
    services: [
      {
        serviceId: formData.get("serviceId"),
        quantity: Number(formData.get("quantity")),
      },
    ],
  };

  try {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      message.hidden = false;
      message.textContent =
        result.details?.[0]?.message || result.message || "No se pudo crear la reserva";
      return;
    }

    message.hidden = false;
    message.classList.remove("error");
    message.textContent = "Reserva creada con éxito";

    form.reset();

    setTimeout(() => {
      window.location.href = `/reservations/${result.payload.id}`;
    }, 1500);
  } catch (error) {
    console.error(error);
    message.hidden = false;
    message.textContent = "Ocurrió un error al crear la reserva";
  }
});

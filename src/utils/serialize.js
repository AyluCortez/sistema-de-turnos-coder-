const asId = (value) => {
  if (value == null) return value;
  return String(value);
};

export const asPublicService = (doc) => {
  if (!doc) return null;

  return {
    _id: asId(doc._id),
    id: asId(doc._id),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    specialty: doc.specialty,
    status: doc.status,
  };
};

const asPublicServiceRef = (service) => {
  if (service == null) return service;
  if (typeof service === "object" && service.title) {
    return asPublicService(service);
  }
  return asId(service);
};

export const asPublicReservation = (doc) => {
  if (!doc) return null;

  return {
    _id: asId(doc._id),
    id: asId(doc._id),
    clientName: doc.clientName,
    date: doc.date,
    services: (doc.services || []).map((item) => ({
      serviceId: asPublicServiceRef(item.serviceId),
      quantity: item.quantity,
    })),
  };
};

const targetBySource = {
  body: "validatedBody",
  query: "validatedQuery",
  params: "validatedParams",
};

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[source] ?? {});

    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "Datos inválidos",
        details: parsed.error.issues.map((issue) => ({
          field: issue.path.join(".") || source,
          message: issue.message,
        })),
      });
    }

    req[targetBySource[source]] = parsed.data;
    return next();
  };
};

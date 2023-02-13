const errorMassage = {
  400: "Bad Request",
  401: "Not Autorize",
  403: "Fobidden",
  404: "Not Found",
  409: "Conflict",
};

const createError = (status, massage = errorMassage[status]) => {
  const error = new Error(massage);
  error.status = status;
  console.log(error);
  return error;
};

module.exports = {
  createError,
};

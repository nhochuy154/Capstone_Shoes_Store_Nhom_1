// Service xác thực người dùng admin
exports.login = (username, password) => {
  return username === "admin" && password === "admin123";
};

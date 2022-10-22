const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000/", //url of your server
      changeOrigin: true,
    })
  );
  app.use(
    "/main",
    createProxyMiddleware({
      target: "http://localhost:8889/", //url of your server
      changeOrigin: true,
    })
  );
};

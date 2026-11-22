const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  const target = process.env.API_PROXY_TARGET;
  if (!target) return;

  app.use('/api', createProxyMiddleware({
    target,
    changeOrigin: true
  }));
};

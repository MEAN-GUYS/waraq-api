const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const bookRoute = require('./book.route');
const orderRoute = require('./order.route');
const docsRoute = require('./docs.route');
const authorRoute = require('./author.route');
const config = require('../../config/config');
const cartRoute = require('./cart.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/books',
    route: bookRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/authors',
    route: authorRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
];

const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;

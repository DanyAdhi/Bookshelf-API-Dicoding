const Hapi = require('@hapi/hapi');
const routes = require('./routes');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5001,
    host: (process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'),
    routes: {
      cors: { origin: ['*'] },
    },
  });

  server.route(routes);

  await server.start();
  // eslint-disable-next-line no-console
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log(err);
  process.exit(1);
});

init();

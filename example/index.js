const {server, auth, pub, api} = require('../index');

const env = (k, v) => process.env[k] = v;

env('NODE_ENV', 'development');
env('JWT_SECRET', 'jwt_secret');
env('DB_HOST', 'localhost');
env('DB_NAME', 'tqapp-test');
env('ROOT_EMAIL', 'root@test.local');
env('ROOT_PASSWORD', 'Abc123!@');

server.li
server.create();
server.app.use(auth.middleware.parse);
server.app.use('/auth', auth.router);
server.app.use('/pub', pub.root('./entity'));
server.app.use('/api/v1', api.root('./entity'));
server.listen(8445);

auth.seed.root();

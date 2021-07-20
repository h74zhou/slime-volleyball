const expressRouter = require('express');
const r = expressRouter.Router();

r.get('/', (req: any, res: any) => {
  res.send('server is up!');
});

module.exports = r;
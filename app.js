const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');

const { rateLimiter } = require('./middlewares/rateLimiter.js');
const config = require('./utils/config');
const centerError = require('./middlewares/center-err.js');

const { PORT = 3000, MNG_URL = config.mongoUrl } = process.env;

const app = express();
const routes = require('./routes/index.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect(MNG_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());

app.use(requestLogger);

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

app.use(errorLogger);
app.use(rateLimiter);

app.use(errors()); // обработчик ошибок celebrate

app.use(centerError);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

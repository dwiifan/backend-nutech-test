require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger/swagger');
const userRoutes = require('./routes/users');
const informationRoutes = require('./routes/information');
const transactionRoutes = require('./routes/transaction');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

const swaggerUiOptions = {
  explorer: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', userRoutes);
app.use('/api', informationRoutes);
app.use('/api', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
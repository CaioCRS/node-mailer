const express = require('express');
const app = express();
require('dotenv').config();

// const rotaUsuario = require('./routes/usuario');
// const rotaLogin = require('./routes/login');
const rotaEmail = require('./routes/email');

const swaggerUi = require('swagger-ui-express');
const security = require('./utils/security');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'node mailer api',
            description: '',
            contact: {
                name: 'Caio Souza'
            },
            servers: ['http://localhost:3000']
        },
        securityDefinitions: {
            bearerAuth: {
              type: 'apiKey',
              name: 'authorization',
              scheme: 'bearer',
              in: 'header',
            },
        },
        security: [ { bearerAuth: [] } ]
    },
    // apis: ['./routes/*.js']
    apis: ['./routes/email.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// As funções abaixo devem ficar antes da validação de Token, pois não exigem verificação do mesmo
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// app.use('/login', rotaLogin);
// app.use('/usuario', rotaUsuario);
// Inicia verificação de Token
//app.use(security.ValidaToken)
// Rota de e-mail deverá ser descomentada somente para testes de envio
app.use('/email', rotaEmail);

module.exports = app;
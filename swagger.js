// Setting up swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SQL Express X Node.js',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}/`,
            }
        ],
    },
    apis: ['./swagger.js'],
}

const swaggerSpec = swaggerJsDoc(swaggerOptions);
module.exports = { swaggerUi, swaggerSpec }

// Schemas for swagger -- It's like a blueprint for different objects
/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  ID:
 *                      type: integer
 *                  Name:
 *                      type: string
 *                  Age:
 *                      type: integer
 *                  Email:
 *                      type: string
 *          UserWithoutID:
 *              type: object
 *              properties:
 *                  Name:
 *                      type: string
 *                  Age:
 *                      type: integer
 *                  Email:
 *                      type: string
 *          UpdatedUser:
 *              type: object
 *              properties:
 *                  ID:
 *                      type: integer
 *                  Name:
 *                      type: string
 *                  Age:
 *                      type: integer
 *                  Email:
 *                      type: string
 *                  old_ID:
 *                      type: integer
 *                  old_Name:
 *                      type: string
 *                  old_Age:
 *                      type: integer
 *                  old_Email:
 *                      type: string
 */


// --- Swagger for HTTP methods ---
/**
 * @swagger
 * /api/users:
 *  get:
 *      summary: To get users from SQL Express Database
 *      description: To get users from SQL Express Database
 *      responses:
 *          200:
 *              description: Succesfully got users from the SQL Express Database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 *          400:
 *              description: Bad Request
 */

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *      summary: To get a user from SQL Express Database
 *      description: To get a user from SQL Express Database
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: ID required
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesfully got a user from the SQL Express Database
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/User'
 *          204:
 *              description: Could not find user in the SQL Express Database
 *          400:
 *              description: Bad Request
 */

/**
 * @swagger
 * /api/users:
 *  post:
 *      summary: To add a new user to the SQL Express Database
 *      description: To add a new user to the SQL Express Database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/UserWithoutID'
 *      responses:
 *          201:
 *              description: Succesfully added a user to the SQL Express Database
 *              content:
 *                  application/json:
 *                      schema:
 *                              $ref: '#components/schemas/User'
 *          400:
 *              description: Bad Request
 */


/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *      summary: To update a user in the SQL Express Database
 *      description: To update a user in the SQL Express Database
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: ID required
 *            schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/UserWithoutID'
 *      responses:
 *          200:
 *              description: Succesfully updated a user in the SQL Express Database
 *              content:
 *                  application/json:
 *                      schema:
 *                              $ref: '#components/schemas/UpdatedUser'
 *          204:
 *              description: Could not find user in the SQL Express Database
 *          400:
 *              description: Bad Request
 */

/**
 * @swagger
 * /api/users/{id}:
 *  delete:
 *      summary: To delete a user from SQL Express Database
 *      description: To delete a user from SQL Express Database
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: ID required
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesfully deleted a user from the SQL Express Database
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/User'
 *          204:
 *              description: Could not find user in the SQL Express Database
 *          400:
 *              description: Bad Request
 */
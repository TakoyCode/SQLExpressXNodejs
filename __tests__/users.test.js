process.env.DATABASE = 'ExpressXNode_Test';
// const doStuff = require("../doStuff");
const request = require("supertest");
const { app } = require("../app");
const { sql, connectToDatabase, closeConnection, } = require("../db");

// first user in the db, saved for testing
let user;

beforeAll(async () => {
    await connectToDatabase();
})

beforeEach(async () => {
    const sqlRequest = new sql.Request();
    const result = await sqlRequest.query(`INSERT INTO users OUTPUT INSERTED.* Values ('Kåre Smith', 23, 'kåre@gmail.com'), ('Bob Burger', 45, 'burger@hotmail.com'), 
                            ('Mari Mcgee', 32, 'MaMc@gmail.com'), ('Wenche Tveter', 58, 'Wenche@live.no'), ('Ole brumm', 90, 'honeycentral@gmail.com')`);
    user = result.recordset[0];
});

afterEach(async () => {
    const sqlRequest = new sql.Request();
    await sqlRequest.query(`Delete from users;`);
})

afterAll(async () => {
    await closeConnection();
})


describe("GET /api/users", () => {
    it("should return all users", async () => {
        const response = await request(app).get('/api/users');
        const users = response.body;
        expect(response.statusCode).toEqual(200);
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(5);
    });
});

describe("GET /api/users/:id", () => {
    it("should return a single user", async () => {
        const response = await request(app).get(`/api/users/${user.ID}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(user);
    });

    it("should respond with a 204 if can't find user", async () => {
        const response = await request(app).get(`/api/users/0`);
        expect(response.statusCode).toEqual(204);
    });

});

describe("POST /api/users", () => {
    it("should create a new user", async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                "Name": "Test",
                "Age": 200,
                "Email": "ItWorked@gmail.com"
            });

        expect(response.statusCode).toEqual(201);

        // Checks if the new user has the correct properties
        expect(response.body).toHaveProperty("ID");
        expect(response.body).toHaveProperty("Name");
        expect(response.body).toHaveProperty("Age");
        expect(response.body).toHaveProperty("Email");

        // Checks if those properties have correct values
        expect(response.body.Name).toEqual("Test");
        expect(response.body.Age).toEqual(200);
        expect(response.body.Email).toEqual("ItWorked@gmail.com");
    });

    it("should respond with a 400 if you don't send new user info", async () => {
        const response = await request(app).post(`/api/users`)
        expect(response.statusCode).toEqual(400);
        expect(response.error.message).toEqual("cannot POST /api/users (400)");
    });
});

describe("POST /api/users/:id", () => {
    it("should update the user", async () => {
        const response = await request(app)
            .put(`/api/users/${user.ID}`)
            .send({
                "Name": "Test",
                "Age": 200,
                "Email": "ItWorked@gmail.com"
            });
        expect(response.statusCode).toEqual(200);
        expect(response.body.ID).toEqual(user.ID);
        expect(response.body.Name).toEqual("Test");
        expect(response.body.Age).toEqual(200);
        expect(response.body.Email).toEqual("ItWorked@gmail.com");
    });

    it("should respond with a 204 if can't find user", async () => {
        const response = await request(app)
            .put(`/api/users/0`)
            .send({
                "Name": "Test",
                "Age": 200,
                "Email": "ItWorked@gmail.com"
            });
        expect(response.statusCode).toEqual(204);
    });

    it("should respond with a 400 if you don't send with info to update user with", async () => {
        const response = await request(app).put(`/api/users/0`)
        expect(response.statusCode).toEqual(400);
        expect(response.error.message).toEqual("cannot PUT /api/users/0 (400)");
    });
});

describe("DELETE /api/users/:id", () => {
    it("should delete a single user", async () => {
        const response = await request(app).delete(`/api/users/${user.ID}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(user);
    });

    it("should respond with a 204 if can't find user", async () => {
        const response = await request(app).delete(`/api/users/0`);
        expect(response.statusCode).toEqual(204);
    });
});
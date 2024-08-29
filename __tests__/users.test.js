const supertest = require("supertest");

process.env.DATABASE = 'ExpressXNode_Test';
const app = require("../app");

describe("GET /api/users", () => {
    test("Gets an array of users", async () => {
        const response = await supertest(app).get(`/api/users`);
        // console.log(response.body);
        const users = response.body;
        expect(response.statusCode).toBe(200);
        expect(users).toHaveLength(6);
        expect(users[0]).toEqual({ "ID": 4, "Name": "Wenche Tveter", "Age": 58, "Email": "Wenche@live.no" });
    });
}); 
process.env.DATABASE = "ExpressXNode_Test";
// npm packages
const supertest = require("supertest");

// app imports
const app = require("../index");






// describe("GET /api/users", () => {
//     test("Gets an array of users", async () => {
//         const response = await supertest(app).get(`/api/users`);
//         const users = response.body;
//         console.log(response);
//         expect(response.statusCode).toBe(200);
//         expect(users).toHaveLength(6);
//         expect(users[0]).toEqual({ "ID": 4, "Name": "Wenche Tveter", "Age": 58, "Email": "Wenche@live.no" });
//     });
// });
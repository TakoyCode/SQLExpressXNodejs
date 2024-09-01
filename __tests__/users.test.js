// process.env.DATABASE = 'ExpressXNode_Test';
// const doStuff = require("../doStuff");
const request = require("supertest");
const { app, connectToDatabase, closeConnection } = require("../app");


// Bedre fiks
beforeAll(async () => {
    await connectToDatabase();
})

afterAll(async () => {
    await closeConnection();
})

// Jalla fiks for nå:
// beforeAll(async () => {
//     await sleep(1000)
// });

// function sleep(ms) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms);
//     });
// }

describe("GET /api/users", () => {
    it("should return all users", async () => {
        const res = await request(app).get("/api/users");
        // console.log(res);
        expect(res.statusCode).toEqual(200);
        // expect(res.body).toBeInstanceOf(Array);
    });
});

// describe("GET /api/users", () => {
//     test("Gets an array of users", async () => {
//         const response = await supertest(app).get('/api/users');
//         // console.log(response.body);
//         const users = response.body;
//         expect(response.statusCode).toBe(200);
//         expect(users).toHaveLength(6);
//         expect(users[0]).toEqual({ "ID": 4, "Name": "Wenche Tveter", "Age": 58, "Email": "Wenche@live.no" });
//     });
// }); 
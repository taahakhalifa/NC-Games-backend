const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe("/api/categories", () => {
    test("GET: 200 - should respond with an array of category objects with required keys", () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({ body }) => {
                expect(body.categories).toBeInstanceOf(Array);

                body.categories.forEach((category) => {
                    expect(category).toHaveProperty("slug");
                    expect(category).toHaveProperty("description");
                });
            });
    });
});

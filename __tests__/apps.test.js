const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe("/api/categories", () => {
    test("GET: 200 - should respond with an array of category objects with the required keys", () => {
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

describe("/api/reviews", () => {
    test("GET: 200 - should resopnd with an array of review objects with the required keys", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeInstanceOf(Array);

                body.reviews.forEach((review) => {
                    expect(review).toHaveProperty("owner");
                    expect(review).toHaveProperty("title");
                    expect(review).toHaveProperty("review_id");
                    expect(review).toHaveProperty("category");
                    expect(review).toHaveProperty("review_img_url");
                    expect(review).toHaveProperty("created_at");
                    expect(review).toHaveProperty("votes");
                    expect(review).toHaveProperty("designer");
                    expect(review).toHaveProperty("comment_count");
                });
            });
    });
    test("GET: 200 = should handle a query in the url to sort by date in descending order", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy("created_at");
            });
    });
});

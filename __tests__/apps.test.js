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
                expect(body.reviews.length).toBe(13);
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

describe("/api/reviews/:review_id", () => {
    test("GET: 200 - should respond with a review obejct which has all the required keys", () => {
        return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({ body }) => {
                expect(body.review).toEqual({
                    review_id: 1,
                    title: "Agricola",
                    designer: "Uwe Rosenberg",
                    owner: "mallionaire",
                    review_img_url:
                        "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
                    review_body: "Farmyard fun!",
                    category: "euro game",
                    created_at: "2021-01-18T10:00:20.514Z",
                    votes: 1,
                });
            });
    });
    test("GET: 400 - should respond with msg Bad Request when endpoint is not a number", () => {
        return request(app)
            .get("/api/reviews/cheese")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
    test("GET: 404 - should respond with msg Not Found when endpoint is a number but is not found", () => {
        return request(app)
            .get("/api/reviews/12345678902843732964287642")
            .expect(404)
            .then(({ body }) => {
                console.log(body);
                expect(body.msg).toBe("Not Found");
            });
    });
});

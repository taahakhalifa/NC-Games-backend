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
                expect(body.msg).toBe("Not Found");
            });
    });
});

describe("/api/reviews/:review_id/comments", () => {
    test("GET: 200 - should respond with an array of comment objects for the given review_id", () => {
        return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toBeInstanceOf(Array);
                expect(body.comments.length).toBe(3);
                body.comments.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id");
                    expect(comment).toHaveProperty("votes");
                    expect(comment).toHaveProperty("created_at");
                    expect(comment).toHaveProperty("author");
                    expect(comment).toHaveProperty("body");
                    expect(comment).toHaveProperty("review_id");
                });
            });
    });
    test("GET: 400 - should respond with msg Bad Request when endpoint is not a number", () => {
        return request(app)
            .get("/api/reviews/cheese/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
    test("GET: 404 - should respond with msg Not Found when endpoint is a number but is not found", () => {
        return request(app)
            .get("/api/reviews/12345678902843732964287642/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
            });
    });
});

describe("/api/reviews/:review_id/comments", () => {
    test("POST: 201 - respond with the posted commenet where the request body accepts an object with all the required keys", () => {
        return request(app)
            .post("/api/reviews/3/comments")
            .expect(201)
            .send({
                body: "10 reasons why cats are better than dogs",
                votes: 103,
                author: "philippaclaire9",
                review_id: 3,
                created_at: new Date(1610964588110),
            })
            .expect(({ body }) => {
                expect(body.comment).toEqual({
                    username: "philippaclaire9",
                    body: "10 reasons why cats are better than dogs",
                });
            });
    });
    test("POST: 400 - should respond with msg Bad Request when endpoint is not a number", () => {
        return request(app)
            .post("/api/reviews/cheese/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
    test("POST: 404 - should respond with msg Not Found when endpoint is a number but is not found", () => {
        return request(app)
            .post("/api/reviews/12345678902843732964287642/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
            });
    });
});

describe("/api/reviews/:review_id", () => {
    test("PATCH: 200 - respond with an updated review where request body accepts an object in the form { inc_votes: newVote }, where newVote is a positive number, and increments the reviews vote property", () => {
        return request(app)
            .patch("/api/reviews/1")
            .expect(200)
            .send({ inc_votes: 46 })
            .then(({ body: [review] }) => {
                expect(review).toEqual({
                    review_id: 1,
                    title: "Agricola",
                    designer: "Uwe Rosenberg",
                    owner: "mallionaire",
                    review_img_url:
                        "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
                    review_body: "Farmyard fun!",
                    category: "euro game",
                    created_at: "2021-01-18T10:00:20.514Z",
                    votes: 47,
                });
            });
    });
    test("PATCH: 400 - should respond with msg Bad Request when endpoint is not a number", () => {
        return request(app)
            .patch("/api/reviews/cheese")
            .expect(400)
            .send({ inc_votes: 46 })
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
    test("PATCH: 404 - should respond with msg Not Found when endpoint is a number but is not found", () => {
        return request(app)
            .patch("/api/reviews/99087986875764675")
            .expect(404)
            .send({ inc_votes: 46 })
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
            });
    });
});

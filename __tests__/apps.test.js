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

describe("/chicken", () => {
    test("GET: 404 - Path does not exist", () => {
        return request(app)
            .get("/chicken")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
            });
    });
});

describe("/api/categories", () => {
    test("GET: 200 - should respond with an array of category objects with the required keys", () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({ body: { categories } }) => {
                expect(categories).toBeInstanceOf(Array);

                categories.forEach((category) => {
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
            .then(({ body: { reviews } }) => {
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews.length).toBe(13);
                reviews.forEach((review) => {
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
            .then(({ body: { reviews } }) => {
                expect(reviews).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
});

describe("/api/reviews/:review_id", () => {
    test("GET: 200 - should respond with a review obejct which has all the required keys", () => {
        return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({ body: { review } }) => {
                expect(review).toHaveProperty("owner");
                expect(review).toHaveProperty("title");
                expect(review).toHaveProperty("review_id");
                expect(review).toHaveProperty("category");
                expect(review).toHaveProperty("review_img_url");
                expect(review).toHaveProperty("created_at");
                expect(review).toHaveProperty("votes");
                expect(review).toHaveProperty("designer");
                expect(review).toHaveProperty("comment_count");

                expect(review).toEqual({
                    comment_count: "0",
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
            .then(({ body: { comments } }) => {
                expect(comments).toBeInstanceOf(Array);
                expect(comments.length).toBe(3);
                comments.forEach((comment) => {
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
                username: "philippaclaire9",
                body: "10 reasons why cats are better than dogs",
            })
            .expect(({ body: { comment } }) => {
                expect(comment).toEqual({
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
    test("POST: 404 - should respond with msg Not Found when username doesn't exist", () => {
        return request(app)
            .post("/api/reviews/1/comments")
            .expect(404)
            .send({
                username: "roccos",
                body: "10 reasons why cats are better than dogs",
            })
            .expect(({ body }) => {
                expect(body.msg).toBe("Not Found");
            });
    });
    test("POST: 400 - should respond with msg Bad Request when one of the required keys are missing", () => {
        return request(app)
            .post("/api/reviews/1/comments")
            .expect(400)
            .send({
                body: "10 reasons why cats are better than dogs",
            })
            .expect(({ body }) => {
                expect(body.msg).toBe("Bad Request");
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

describe("/api/users", () => {
    test("GET: 200 - should resopnd with an array of objects with the required keys", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
                console.log(users);
                expect(users).toBeInstanceOf(Array);
                expect(users.length).toBe(4);
                users.forEach((user) => {
                    expect(user).toHaveProperty("username");
                    expect(user).toHaveProperty("name");
                    expect(user).toHaveProperty("avatar_url");
                });
            });
    });
});

describe("/api/reviews", () => {
    test("GET: 200 - should handle a category query, which selects the reviews by the category value specified in the query.", () => {
        const query1 = "category";
        const query2 = "dexterity";
        return request(app)
            .get(`/api/reviews?${query1}=${query2}`)
            .expect(200)
            .then(({ body: { reviews } }) => {
                reviews.forEach((review) => {
                    expect(review.category).toBe("dexterity");
                });
            });
    });

    test("GET: 200 - should handle a sort_by query, which sorts the articles by date which is the default", () => {
        return request(app)
            .get(`/api/reviews`)
            .expect(200)
            .then(({ body: { reviews } }) => {
                expect(reviews).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
    test("GET: 200 - should handle a sort_by query, which sorts the articles by any valid column", () => {
        const query = "sort_by";
        return request(app)
            .get(`/api/reviews?${query}=votes`)
            .expect(200)
            .then(({ body: { reviews } }) => {
                expect(reviews).toBeSortedBy("votes", {
                    descending: true,
                });
            });
    });
    test("GET: 200 - should handle a order query, which defaults to descending", () => {
        return request(app)
            .get(`/api/reviews?sort_by=votes`)
            .expect(200)
            .then(({ body: { reviews } }) => {
                expect(reviews).toBeSortedBy("votes", {
                    descending: true,
                });
            });
    });
    test("GET: 200 - should handle a order query, which can be set to `asc` or `desc` for ascending or descending", () => {
        return request(app)
            .get(`/api/reviews?sort_by=votes&order=asc`)
            .expect(200)
            .then(({ body: { reviews } }) => {
                expect(reviews).toBeSortedBy("votes", {
                    descending: false,
                });
            });
    });
});
describe("TEST", () => {
    test("GET: 404 - should respond with msg Not Found when category is not found in the database", () => {
        return request(app)
            .get(`/api/reviews?category=chicken`)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
            });
    });
    test("GET: 200 - should respond with empty array when category exists but does not have any reviews associated to it", () => {
        return request(app)
            .get(`/api/reviews?category=children's+games`)
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toEqual([]);
            });
    });
    test("GET: 400 - should respond with msg Bad Request when sort_by column doesn't exist", () => {
        return request(app)
            .get("/api/reviews?sort_by=chicken")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
    test("GET: 400 - should respond with msg Bad Request when order is neither asc nor desc", () => {
        return request(app)
            .get(`/api/reviews?sort_by=votes&order=chicken`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
});
describe("/api/comments/:comment_id", () => {
    test("DELETE: 204 - should delete specified comment from the database", () => {
        return request(app).delete("/api/comments/1").expect(204);
    });
    test("DELETE: 404: comment id valid but does not exist", () => {
        return request(app)
            .delete("/api/comments/40")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toEqual("Not Found");
            });
    });
    test("DELETE: 400: comment id format incorrect", () => {
        return request(app)
            .delete("/api/comments/banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toEqual("Bad Request");
            });
    });
});

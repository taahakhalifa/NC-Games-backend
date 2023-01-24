# Taaha Khalifa's Backend Games API

---

## Introduction

The NorthGamers `API` is a database API for game reviews that I created as part of my full-stack software developer bootcamp at Northcoders. The API provides a simple interface for users to access game reviews and comments. This `README` will help you through the installation and implementation of the API locally onto your machine.

Please feel free to investigate all the potential API endpoints as a starting point on the API [here](https://taahakhalifa-nc-games-api.onrender.com/api). Downloading the [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en) extension on Chrome is recommended prior to visiting the link.

---

## Summary of Project

This API was designed to access application data programmatically and to simulate the construction of a real-world backend service (such as [Reddit](https://www.reddit.com/)).

The objective of this specific project is to provide a backend API for a database of game reviews, which would subsequently supply the front-end developer with the necessary tools. The API provides customers with access to a variety of game reviews and user-submitted comments regarding these games.

Test Driven Development `(TDD)` was used to rigorously test all endpoints and accompanying functions in order to build a solid structure for the API. The Model View Controller `(MVC)` software pattern was used to design and organise all of the code, allowing for a more efficient division of labour and enhanced maintenance.

---

## Tools Utilised

-   `PostgreSQL` : Used as the API database's primary data warehouse.
-   `Express` : A Node.js web application framework which enabled me to specify which function is invoked for a certain HTTP verb and URL pattern.
-   `Dotenv` : Used to manage my environment variables and to provide additional protection.
-   `Jest & Supertest` : Used to write automated tests for my routes and endpoints.

---

## Initial Setup

Minimum versions of Node.js and Postgres needed to run this project are:

```bash
Node: v19.0.0
Postgres: v12.12
```

1. `Clone the repository` to your local machine. To do this, open up your terminal and run the following command:

```bash
git clone https://github.com/taahakhalifa/taahakhalifa-NC-GAMES-BACKEND.git
```

2. Now that you have cloned the repo, `open` it in your preferred code editor.

3. Next, `install the dependencies` required to run this project. To do this, `run the following command`:

```bash
npm install
```

---

## Creating the .env files

Now that you have completed the inital setup, you will need to `create the two environment variable files`. To do this, complete the following steps precisely.

1. Create a file called ".env.test" and copy the following text to it:

```bash
PGDATABASE=nc_games_test;
```

2. Create another file called ".env.development" and copy the following text to it:

```bash
PGDATABASE=nc_games;
```

---

## Scripts

Now that both .env files are created, we will need to `run some scripts` to get the code to run.

1. `Create the databases` by running the following command:

```bash
npm run setup-dbs
```

2. You will now need to `seed the databases` by running the following command:

```bash
npm run seed
```

3. The final step now is to `check` if everything was set up correctly. To do this, run the following command and watch those green ticks come in!

```bash
npm test
```

---

If every test has passed, congratulations! You have succesfully installed this repository to your local machine.

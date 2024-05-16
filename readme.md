# Jobly Backend

This is the Express backend for Jobly, version 2.

To run this:

    node server.js

To run the tests:

    jest -i

## Steps

- [x] Create database for Jobly and Jobly_test
- [x] Write unit tests for sqlForPartialUpdate and document the function
- [x] Add a name, minEmployees, maxEmployees, and handle query string to the GET /companies route (400 error and message if minEmployees > maxEmployees)
- [x] Add filter methods and write unit tests for the model
- [x] Add authentication checks without adding code to the route

  ```js
  // app.js
  app.use(authenticateJWT);

  // The authenticateJWT function is defined in middleware/auth.js
  // It uses the jsonwebtoken library to verify the token and store the payload in res.locals.user
  res.locals.user = jwt.verify(token, SECRET_KEY);

  // helpers/tokens.js
  function createToken(user) {
    console.assert(
      user.isAdmin !== undefined,
      "createToken passed user without isAdmin property"
    );

    let payload = {
      username: user.username,
      isAdmin: user.isAdmin || false,
    };

    return jwt.sign(payload, SECRET_KEY);
  }

  // This tells you that you will have access to the username and isAdmin properties in res.locals.user
  ```

- [x] Update tests for auth routes (read directions)
- [x] Add job model and tests
- [x] Add job creation, get, update, and delete routes. Use the same ensureLoggedIn or ensureAdmin middleware as the company routes (read directions)
- [x] Add filtering by title minSalary, and hasEquity to the GET /jobs route
- [x] Change company/:handle route to also show jobs for that company
- [x] Add a POST /users/:username/jobs/:id (read directions)
- [x] Change the output of the get-all-info route to include applied jobs

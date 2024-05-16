const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", () => {
  test("Converts an obj to a SQL string", () => {
    const update = sqlForPartialUpdate(
      { firstName: "test", age: 25 },
      { firstName: "first_name", age: "age" }
    );
    expect(update).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["test", 25],
    });
  });
});

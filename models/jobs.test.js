"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Jobs = require("./jobs.js");
const Company = require("./company.js");

describe("Jobs Model", () => {
  test("create", async () => {
    const sample = {
      title: "Associate At Company",
      salary: 20000,
      equity: 0.5,
      companyHandle: "c1",
    };

    let job = await Jobs.create(sample);

    expect(job).toEqual({
      ...sample,
      id: job.id,
      equity: "0.5",
    });
  });
  test("remove", async () => {
    const sample = {
      title: "Associate At Company",
      salary: 20000,
      equity: 0.5,
      companyHandle: "c1",
    };

    let job = await Jobs.create(sample);
    await Jobs.remove(job.id);

    Jobs.get(job.id)
      .then((res) => {})
      .catch((err) => {
        expect(err).toBeTruthy();
      });
  });
  test("findAll", async () => {
    const sample = {
      title: "Associate At Company",
      salary: 20000,
      equity: 0.5,
      companyHandle: "c1",
    };

    await db.query("DELETE FROM jobs");

    let job = await Jobs.create(sample);

    const res = await Jobs.findAll();

    expect(res).toEqual([
      {
        ...job,
      },
    ]);
  });
});

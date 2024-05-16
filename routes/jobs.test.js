"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const Job = require("../models/jobs");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /jobs", function () {
  const newJob = {
    title: "New",
    salary: 20000,
    equity: 0.5,
    companyHandle: "c2",
  };

  test("ok for users", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.error).toEqual(false);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        ...newJob,
        equity: "0.5",
        id: resp.body.job.id,
      },
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        salary: 20000,
        equity: 0.5,
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        ...newJob,
        companyHandle: 4,
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const job1 = await Job.create({
      title: "Office Janitor",
      salary: 20000,
      equity: 0.5,
      companyHandle: "c1",
    });
    const job2 = await Job.create({
      title: "Office Associate",
      salary: 25000,
      equity: 0.4,
      companyHandle: "c1",
    });
    const job3 = await Job.create({
      title: "Office Manager",
      salary: 50000,
      equity: 0.7,
      companyHandle: "c1",
    });
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs: [
        {
          id: job1.id,
          title: "Office Janitor",
          salary: 20000,
          equity: "0.5",
          companyHandle: "c1",
        },
        {
          id: job2.id,
          title: "Office Associate",
          salary: 25000,
          equity: "0.4",
          companyHandle: "c1",
        },
        {
          id: job3.id,
          title: "Office Manager",
          salary: 50000,
          equity: "0.7",
          companyHandle: "c1",
        },
      ],
    });
  });
});

// /************************************** GET /companies/:handle */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const job = await Job.create({
      title: "Office Janitor",
      salary: 20000,
      equity: 0.5,
      companyHandle: "c1",
    });
    const resp = await request(app).get(`/jobs/${job.id}`);
    expect(resp.body).toEqual({
      job: {
        ...job,
        equity: "0.5",
      },
    });
  });

  test("works for anon: company w/o jobs", async function () {
    const job = await Job.create({
      title: "Office Janitor",
      salary: 20000,
      equity: 0.5,
      companyHandle: "c2",
    });

    const resp = await request(app).get(`/jobs/${job.id}`);
    expect(resp.body).toEqual({
      job: {
        ...job,
      },
    });
  });

  test("not found for no such job", async function () {
    const resp = await request(app)
      .get(`/jobs/11111`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

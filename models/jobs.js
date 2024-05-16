"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Jobs {
  static async create({ title, salary, equity, companyHandle }) {
    const result = await db.query(
      `INSERT INTO jobs
            (title, salary, equity, company_handle)
            VALUES($1, $2, $3, $4)
            RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [title, salary, equity, companyHandle]
    );
    const job = result.rows[0];

    return job;
  }
  static async findAll(filters = {}) {
    const { title, minSalary, hasEquity } = filters;
    const whereClauses = [];
    const queryParams = [];

    if (title) {
      queryParams.push(`%${title}%`);
      whereClauses.push(`title ILIKE $${queryParams.length}`);
    }

    if (minSalary !== undefined) {
      queryParams.push(minSalary);
      whereClauses.push(`salary >= $${queryParams.length}`);
    }

    if (hasEquity) {
      whereClauses.push(`equity > 0`);
    }

    let query = `SELECT id, title, salary, equity, company_handle AS "companyHandle" FROM jobs`;
    if (whereClauses.length) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }
    const result = await db.query(query, queryParams);
    return result.rows;
  }
  static async get(id) {
    const jobRes = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle" FROM jobs WHERE id = $1`,
      [id]
    );

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No jobs: ${id}`);

    return job;
  }
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      companyHandle: "company_handle",
    });
    const idGenerator = "$" + (values.length + 1);

    const querySql = `UPDATE jobs SET ${setCols} WHERE id = ${idGenerator} RETURNING id, title, salary, equity, company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }
  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs WHERE id = $1 RETURNING id`,
      [id]
    );
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No company ${id}`);
  }
  static async getJobsForCompany(companyId) {
    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle" FROM jobs WHERE company_handle = $1 `,
      [companyId]
    );
    return result.rows;
  }
}

module.exports = Jobs;

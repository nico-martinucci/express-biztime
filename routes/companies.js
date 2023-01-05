"use strict";

const express = require("express");
const { NotFoundError } = require("../expressError");

const db = require("../db");
const router = new express.Router();

// routes

/** GET /companies
Returns list of companies, like {companies: [{code, name}, ...]}*/
router.get("/", async function (req, res) {
    const result = await db.query(
        `SELECT code, name FROM companies`
    )

    return res.json({ companies: result.rows });
})

/** GET /companies/[code]
 Return obj of company: {company: {code, name, description}}
 If the company given cannot be found, this should return a 404 status response.*/
router.get("/:code", async function (req, res) {
    const code = req.params.code;
    const result = await db.query(
        `SELECT code, name, description FROM companies
            WHERE code = $1`,
        [code]
    )

    return res.json({ companies: result.rows[0] });
})

/** POST /companies
 Adds a company.
 Needs to be given JSON like: {code, name, description}
 Returns obj of new company: {company: {code, name, description}}*/
router.post("/", async function (req, res) {
    const { code, name, description } = req.body;
    const result = await db.query(
        `INSERT INTO companies
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
        [code, name, description]
    )

    return res.status(201).json({ company: result.rows[0] });
})

/** PUT /companies/[code]
Edit existing company. Should return 404 if company cannot be found.
Needs to be given JSON like: {name, description}
Returns update company object: {company: {code, name, description}}*/

/** DELETE /companies/[code]
Deletes company.
Should return 404 if company cannot be found.
Returns {status: "deleted"}*/



module.exports = router;
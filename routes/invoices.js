"use strict";

const express = require("express");
const { NotFoundError } = require("../expressError");

const db = require("../db");
const router = new express.Router();

/**GET /invoices
Return info on invoices: like {invoices: [{id, comp_code}, ...]} */
router.get("/", async function (req, res) {
    const result = await db.query(
        `SELECT id, comp_code 
            FROM invoices`
        );

    return res.json({ invoices: result.rows });
});

/**GET /invoices/[id]
Returns obj on given invoice.
If invoice cannot be found, returns 404.
Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}} */
router.get("/:id", async function (req, res) {
    const id = req.params.id;
    const iResult = await db.query(
        `SELECT id, amt, paid, add_date, paid_date, comp_code AS company 
            FROM invoices
            WHERE id = $1`, 
        [id]
    );

    const invoice = iResult.rows[0];

    if (!invoice) throw new NotFoundError(`No matching invoice: ${id}`);

    const cResult = await db.query(
        `SELECT code, name, description 
            FROM companies
            WHERE code = '${invoice.company}'` // DON'T FORGET QUOTES!!!!!
    )

    invoice.company = cResult.rows[0];

    return res.json({ invoice });
});

/**POST /invoices
Adds an invoice.
Needs to be passed in JSON body of: {comp_code, amt}
Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}} */
router.post("/", async function (req, res) {
    const { comp_code, amt } = req.body;
    const result = await db.query(
        `INSERT INTO invoices (comp_code, amt)
                VALUES ($1, $2)
                RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [comp_code, amt]
    );

    const invoice = result.rows[0];

    return res.status(201).json({ invoice })
});

module.exports = router;
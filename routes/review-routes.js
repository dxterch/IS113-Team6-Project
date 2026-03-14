const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("reviews");
});

module.exports = router;
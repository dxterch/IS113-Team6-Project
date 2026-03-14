const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("manage-songs");
});

module.exports = router;
const express = require("express");
const router = express.Router();

router.get("/manage", (req, res) => {
    res.render("manage-artist");
});

module.exports = router;
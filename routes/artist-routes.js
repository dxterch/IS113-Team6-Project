const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist-controller");

// READ: Show Artist Page
router.get("/manage", artistController.showArtistPage);

// CREATE: Show Create Artist Page
router.get("/create", artistController.showCreateArtistPage);
router.post("/create", artistController.processAddArtist);

// UPDATE: Show Update Artist Page
router.get("/update", artistController.showUpdateArtistPage);
router.post("/update", artistController.processUpdateArtist);

// DELETE: Process Deletion of Artist
router.post("/delete", artistController.processDeleteArtist);

module.exports = router;
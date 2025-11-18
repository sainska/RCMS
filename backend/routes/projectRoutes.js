const express = require("express");
const router = express.Router();
const { createProject, getProjectsByUser } = require("../controllers/projectController");

router.post("/create", createProject);
router.get("/user/:userId", getProjectsByUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getAllProjects } = require("../controllers/project.controller");

router.get("/", getAllProjects); // GET /api/projects

module.exports = router;

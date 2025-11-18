// backend/routes/progress.routes.js
const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progress.controller");


router.get("/:projectId", progressController.getProgressByProjectId);

router.post("/:projectId", progressController.addStage);

router.put("/:projectId/:stageId", progressController.updateStage);

router.delete("/:projectId/:stageId", progressController.deleteStage);

module.exports = router;

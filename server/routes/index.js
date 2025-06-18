const express = require("express");
const router = express.Router();

// Root path response
router.get("/", (req, res) => {
	res.status(200).send("Backend funcionando en puerto 3000 - ASIGNATURA FRONTEND - IPG 2025");
});

module.exports = router;

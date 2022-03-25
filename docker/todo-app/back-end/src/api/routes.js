const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = express();

const tasksController = require('../controllers/Tasks');

routes.use(cors());
routes.use(express.json());

routes.use(morgan('tiny'));

routes.get("/tasks", tasksController.getAllTasks);

routes.post("/task", tasksController.addTask);
routes.get("/task/:id", tasksController.getTask);
routes.delete("/task/:id", tasksController.rmTask);
routes.put("/task/:id", tasksController.putTask);

routes.post("/debug", tasksController.resetTasks);

module.exports = routes;

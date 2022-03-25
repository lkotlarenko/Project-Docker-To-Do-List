const { readFile, writeFile } = require('../utils/fileHandler');
const uuid = require('uuid').v4;

const jsonDBPath = "./src/database/";

const getAllTasks = async () => readFile(`${jsonDBPath}tasks.json`)
  .then((file)=> JSON.parse(file))
  .catch(({ message })=> new Error(`Não foi possível consultar o banco de dados:\n${message}`));

const getTask = async (id) => getAllTasks()
  .then((tasks)=> tasks.filter(item=> item.id === id))
  .catch(({ message })=> new Error(`Não foi possível consultar o banco de dados:\n${message}`));

const addTask = async (description) => {
  if(!description) return false;

  const newTask = {
    id: uuid(),
    description,
    check: false
  };

  const tasks = await getAllTasks();
  tasks.push(newTask);

  writeFile(`${jsonDBPath}tasks.json`, JSON.stringify(tasks, 0, 2));

  return newTask
}

const rmTask = async (id) => {
  if(!id) return false;

  const tasks = await getAllTasks();
  const newTaskList = tasks.filter(item => item.id !== id);

  writeFile(`${jsonDBPath}tasks.json`, JSON.stringify(newTaskList, 0, 2));

  return true
}

const putTask = async (id, description, check) => {
  if(!id) return false;
  
  const tasks = await getAllTasks();
  const newTaskList = tasks.map(item => {
    if (item.id !== id) {
      return item;
    } else {
      return {
        ...item,
        description: description || item.description,
        check: check !== undefined ? check : item.check
      }
    }
  });

  writeFile(`${jsonDBPath}tasks.json`, JSON.stringify(newTaskList, 0, 2));

  return true
}

const resetTasks = async () => {
  const bkpTasks = await readFile(`${jsonDBPath}tasks.bkp.json`)
    .then((file)=> JSON.parse(file))
    .catch(({ message })=> new Error(`Não foi possível consultar o banco de dados:\n${message}`));

  writeFile(`${jsonDBPath}tasks.json`, JSON.stringify(bkpTasks, 0, 2));

  return true
}

module.exports = {
  getAllTasks,
  getTask,
  addTask,
  rmTask,
  putTask,
  resetTasks
}

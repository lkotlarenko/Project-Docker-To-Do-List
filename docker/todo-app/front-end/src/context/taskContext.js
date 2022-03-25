import { createContext, useState } from "react";
import taskApi from '../utils/fetch';

const TaskContext = createContext();

export function TaskProvider ({ children }) {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => taskApi('GET', 'tasks')
    .then(({ data: tasks }) => setTasks(tasks));

  const getTask = async (id) => taskApi('GET', `task/${id}`)
    .then(({ data: task }) => task);

  const addTask = async (description) => taskApi('POST', 'task', { description })
    .then(getTasks);

  const rmTask = async (id) => taskApi('DELETE', `task/${id}`)
    .then(getTasks);

  const putTask = async (id, description, check) => taskApi('PUT', `task/${id}`, { description, check })
    .then(getTasks);
  
  const resetTasks = async () => taskApi('POST', 'debug')
    .then(()=>true)
    .catch(()=>console.error('Não foi possível restaurar as tarefas'));

  const contextValue = {
    tasks,
    getTasks,
    getTask,
    addTask,
    rmTask,
    putTask,
    resetTasks
  };

  return (
    <TaskContext.Provider value={ contextValue }>
      { children }
    </TaskContext.Provider>
  );
}

export default TaskContext;

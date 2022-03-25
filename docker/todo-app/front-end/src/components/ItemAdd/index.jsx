import React, { useContext, useState } from 'react';
import './styles.css';
import { FaPlus } from 'react-icons/fa';
import TaskContext from '../../context/taskContext';

function ItemAdd() {
  const [description, setDescription] = useState("");
  const { addTask } = useContext(TaskContext);

  const handleAdd = async () => addTask(description);

  return (
    <div className="item-add">
      <div>
        <label>Nova tarefa:</label>
        <input
          data-testid="todo-task-input" 
          value={description} 
          onChange={
            ({target: { value }}) => setDescription(value)
          } 
        />
      </div>
      <button
        data-testid="todo-task-add"
        onClick={handleAdd}
      ><FaPlus /></button>
    </div>
  );
}

export default ItemAdd;

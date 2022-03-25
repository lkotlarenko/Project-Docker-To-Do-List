import React, { useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import TaskContext from '../../context/taskContext';

function TaskReset() {
  const { resetTasks } = useContext(TaskContext);
  const history = useHistory();

  useEffect(() => (resetTasks && history) 
    && resetTasks()
      .then(() => history.push('/')), 
        [resetTasks, history]);

  return <div />;
}

export default TaskReset;

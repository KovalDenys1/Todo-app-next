'use client';

import { useState } from 'react';
import TaskInputForm from './elements/TaskInputForm';
import TaskColumn from './elements/TaskColumn';
import { Task } from './elements/Types';

export default function Home() {
  const [tasksArray, setTasksArray] = useState<Task[]>([]);

  const handleAddTask = (text: string, category: 'Home' | 'Work' | 'School', priority: 'High' | 'Medium' | 'Low') => {
    setTasksArray((prevTasksArray) => [...prevTasksArray, { text, category, priority }]);
  };

  const handleDeleteTask = (taskText: string, category: 'Home' | 'Work' | 'School') => {
    setTasksArray((prevTasksArray) => 
      prevTasksArray.filter((task) => 
        !(task.text === taskText && task.category === category)
      )
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">To-Do App</h1>
          <p className="text-muted-foreground">Made by Denys Koval</p>
        </div>
        
        <div className="mb-8">
          <TaskInputForm onAddTask={handleAddTask} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="🏠 Home"
            tasks={tasksArray.filter((task) => task.category === 'Home')}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="💼 Work"
            tasks={tasksArray.filter((task) => task.category === 'Work')}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="🎓 School"
            tasks={tasksArray.filter((task) => task.category === 'School')}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
}

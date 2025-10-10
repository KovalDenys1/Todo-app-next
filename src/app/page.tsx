'use client';

import { useState, useEffect } from 'react';
import TaskInputForm from './elements/TaskInputForm';
import TaskColumn from './elements/TaskColumn';
import { Task } from './elements/Types';
import { ThemeToggle } from '@/components/theme-toggle';

// Constants
const STORAGE_KEY = 'denys-todo-app-tasks';

// Utility functions for localStorage
const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

const loadTasks = (): Task[] => {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      // Validate the loaded data
      if (Array.isArray(parsed)) {
        return parsed.filter((task): task is Task => 
          task && 
          typeof task.text === 'string' && 
          ['Home', 'Work', 'School'].includes(task.category) &&
          ['High', 'Medium', 'Low'].includes(task.priority)
        );
      }
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }
  return [];
};

export default function Home() {
  const [tasksArray, setTasksArray] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = loadTasks();
    setTasksArray(savedTasks);
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage whenever tasksArray changes
  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasksArray);
    }
  }, [tasksArray, isLoaded]);

  const handleAddTask = (text: string, category: 'Home' | 'Work' | 'School', priority: 'High' | 'Medium' | 'Low') => {
    const newTask: Task = { text, category, priority };
    setTasksArray((prevTasksArray) => [...prevTasksArray, newTask]);
  };

  const handleDeleteTask = (taskText: string, category: 'Home' | 'Work' | 'School') => {
    setTasksArray((prevTasksArray) => 
      prevTasksArray.filter((task) => 
        !(task.text === taskText && task.category === category)
      )
    );
  };

  const handleEditTask = (oldText: string, category: 'Home' | 'Work' | 'School', newText: string) => {
    setTasksArray((prevTasksArray) => 
      prevTasksArray.map((task) => 
        task.text === oldText && task.category === category
          ? { ...task, text: newText }
          : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">To-Do App</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Made by Denys Koval</p>
          </div>
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
            <ThemeToggle />
          </div>
        </div>
        
        <div className="mb-6 sm:mb-8">
          <TaskInputForm onAddTask={handleAddTask} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <TaskColumn
            title="🏠 Home"
            tasks={tasksArray.filter((task) => task.category === 'Home')}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            title="💼 Work"
            tasks={tasksArray.filter((task) => task.category === 'Work')}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            title="🎓 School"
            tasks={tasksArray.filter((task) => task.category === 'School')}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        </div>
      </div>
    </div>
  );
}

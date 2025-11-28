'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, Toaster } from "sonner";
import { loadSession, clearSession } from '@/lib/auth';
import LoginPage from '@/components/LoginPage';
import { LogOut, CheckCircle2, Circle } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

type Category = 'Home' | 'Work' | 'School';
type Priority = 'High' | 'Medium' | 'Low';

type Task = {
  id: string;
  text: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  createdAt: number;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY_PREFIX = 'denys-todo-app-tasks';

// Helper to get user-specific storage key
const getUserStorageKey = (username: string) => `${STORAGE_KEY_PREFIX}-${username}`;

const CATEGORIES = [
  { value: 'Home' as Category, label: 'Home', icon: '🏠' },
  { value: 'Work' as Category, label: 'Work', icon: '💼' },
  { value: 'School' as Category, label: 'School', icon: '🎓' },
] as const;

const PRIORITIES = [
  { value: 'High' as Priority, label: 'High', icon: '🔴', color: 'border-l-red-500', variant: 'destructive' as const, order: 1 },
  { value: 'Medium' as Priority, label: 'Medium', icon: '🟡', color: 'border-l-yellow-500', variant: 'outline' as const, order: 2 },
  { value: 'Low' as Priority, label: 'Low', icon: '🟢', color: 'border-l-green-500', variant: 'secondary' as const, order: 3 },
] as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const saveTasks = (tasks: Task[], username: string) => {
  try {
    const storageKey = getUserStorageKey(username);
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

const loadTasks = (username: string): Task[] => {
  try {
    const storageKey = getUserStorageKey(username);
    const savedTasks = localStorage.getItem(storageKey);
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      if (Array.isArray(parsed)) {
        return parsed.filter((task): task is Task => 
          task && 
          typeof task.id === 'string' &&
          typeof task.text === 'string' && 
          ['Home', 'Work', 'School'].includes(task.category) &&
          ['High', 'Medium', 'Low'].includes(task.priority)
        ).map(task => ({
          ...task,
          completed: task.completed ?? false,
          createdAt: task.createdAt ?? Date.now()
        }));
      }
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }
  return [];
};

const getPriorityConfig = (priority: Priority) => {
  return PRIORITIES.find(p => p.value === priority) || PRIORITIES[1];
};

// ============================================================================
// TASK INPUT FORM COMPONENT
// ============================================================================

type TaskInputFormProps = {
  onAddTask: (task: string, category: Category, priority: Priority) => void;
};

function TaskInputForm({ onAddTask }: TaskInputFormProps) {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState<Category>('Home');
  const [priority, setPriority] = useState<Priority>('Medium');

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task, category, priority);
      setTask('');
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-center">
      <Input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
        className="w-full sm:flex-1"
      />
      <div className="flex gap-3 sm:gap-4">
        <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
          <SelectTrigger className="flex-1 sm:w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
          <SelectTrigger className="flex-1 sm:w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map(pri => (
              <SelectItem key={pri.value} value={pri.value}>
                {pri.icon} {pri.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Add Task
      </Button>
    </form>
  );
}

// ============================================================================
// TASK COLUMN COMPONENT
// ============================================================================

type TaskColumnProps = {
  title: string;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, newText: string) => void;
  onToggleComplete: (taskId: string) => void;
};

function TaskColumn({ title, tasks, onDeleteTask, onEditTask, onToggleComplete }: TaskColumnProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityA = getPriorityConfig(a.priority).order;
    const priorityB = getPriorityConfig(b.priority).order;
    return priorityA - priorityB;
  });

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditValue(task.text);
  };

  const saveEdit = (taskId: string) => {
    if (editValue.trim()) {
      onEditTask(taskId, editValue.trim());
    }
    setEditingTaskId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditValue('');
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">{title}</CardTitle>
          {totalCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {completedCount}/{totalCount}
            </Badge>
          )}
        </div>
        {totalCount > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{completionPercent}% Complete</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        )}
        <Separator className="mt-3" />
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8">
            <Circle className="mx-auto h-12 w-12 text-muted-foreground/30 mb-2" />
            <p className="text-muted-foreground text-sm">No tasks yet</p>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const priorityConfig = getPriorityConfig(task.priority);
            const isEditing = editingTaskId === task.id;

            return (
              <Card key={task.id} className={`border-l-4 ${priorityConfig.color} hover:shadow-md transition-all duration-200 ${task.completed ? 'opacity-60' : ''}`}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex gap-3 items-start">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => onToggleComplete(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveEdit(task.id);
                              } else if (e.key === 'Escape') {
                                cancelEdit();
                              }
                            }}
                            className="text-sm sm:text-base"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => saveEdit(task.id)}
                              size="sm"
                              className="text-xs"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={cancelEdit}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span 
                            className={`font-medium text-sm sm:text-base break-words cursor-pointer hover:text-primary transition-colors ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            onDoubleClick={() => startEditing(task)}
                            title="Double-click to edit"
                          >
                            {task.text}
                          </span>
                          <div className="mt-2 flex gap-2 items-center">
                            <Badge variant={priorityConfig.variant} className="text-xs">
                              {priorityConfig.icon} {priorityConfig.label}
                            </Badge>
                            {task.completed && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Done
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEditing(task)}
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm shrink-0"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => onDeleteTask(task.id)}
                          variant="destructive"
                          size="sm"
                          className="text-xs sm:text-sm shrink-0"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Home() {
  const [tasksArray, setTasksArray] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const session = loadSession();
    if (session) {
      setIsAuthenticated(true);
      setUsername(session.username);
      // Load tasks for the logged-in user
      const savedTasks = loadTasks(session.username);
      setTasksArray(savedTasks);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && username) {
      saveTasks(tasksArray, username);
    }
  }, [tasksArray, isLoaded, username]);

  const handleLoginSuccess = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
    // Load tasks for the newly logged-in user
    const userTasks = loadTasks(user);
    setTasksArray(userTasks);
    toast.success(`Welcome back, ${user}!`);
  };

  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    setUsername('');
    setTasksArray([]); // Clear tasks on logout
    toast.info('Logged out successfully');
  };

  const handleAddTask = (text: string, category: Category, priority: Priority) => {
    const newTask: Task = { 
      id: crypto.randomUUID(), 
      text, 
      category, 
      priority,
      completed: false,
      createdAt: Date.now()
    };
    setTasksArray((prev) => [...prev, newTask]);
    toast.success('Task added successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasksArray((prev) => prev.filter((task) => task.id !== taskId));
    toast.success('Task deleted');
  };

  const handleEditTask = (taskId: string, newText: string) => {
    setTasksArray((prev) => 
      prev.map((task) => 
        task.id === taskId ? { ...task, text: newText } : task
      )
    );
    toast.success('Task updated');
  };

  const handleToggleComplete = (taskId: string) => {
    setTasksArray((prev) => 
      prev.map((task) => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          if (newCompleted) {
            toast.success('Task completed! 🎉');
          }
          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const totalTasks = tasksArray.length;
  const completedTasks = tasksArray.filter(t => t.completed).length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">To-Do App</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Welcome, <span className="font-medium">{username}</span>
              </p>
            </div>
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <ThemeToggle />
            </div>
          </div>

          {totalTasks > 0 && (
            <Card className="mb-6 sm:mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold mb-1">Overall Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      {completedTasks} of {totalTasks} tasks completed
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{overallProgress}%</div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 mt-4">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mb-6 sm:mb-8">
            <TaskInputForm onAddTask={handleAddTask} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {CATEGORIES.map(category => (
              <TaskColumn
                key={category.value}
                title={`${category.icon} ${category.label}`}
                tasks={tasksArray.filter((task) => task.category === category.value)}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Made by Denys Koval
          </div>
        </div>
      </div>
    </>
  );
}

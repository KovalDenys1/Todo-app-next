import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TaskInputFormProps = {
  onAddTask: (task: string, category: 'Home' | 'Work' | 'School', priority: 'High' | 'Medium' | 'Low') => void;
};

export default function TaskInputForm({ onAddTask }: TaskInputFormProps) {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState<'Home' | 'Work' | 'School'>('Home');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value as 'Home' | 'Work' | 'School');
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value as 'High' | 'Medium' | 'Low');
  };

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
        onChange={handleInputChange}
        placeholder="Enter task"
        className="w-full sm:flex-1"
      />
      <div className="flex gap-3 sm:gap-4">
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="flex-1 sm:w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Home">🏠 Home</SelectItem>
            <SelectItem value="Work">💼 Work</SelectItem>
            <SelectItem value="School">🎓 School</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={handlePriorityChange}>
          <SelectTrigger className="flex-1 sm:w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">🔴 High</SelectItem>
            <SelectItem value="Medium">🟡 Medium</SelectItem>
            <SelectItem value="Low">🟢 Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Add Task
      </Button>
    </form>
  );
}

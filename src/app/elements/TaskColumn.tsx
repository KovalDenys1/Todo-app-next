import { useState } from 'react';
import { Task } from './Types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

type TaskColumnProps = {
  title: string;
  tasks: Task[];
  onDeleteTask: (taskText: string, category: 'Home' | 'Work' | 'School') => void;
  onEditTask: (oldText: string, category: 'Home' | 'Work' | 'School', newText: string) => void;
};

export default function TaskColumn({ title, tasks, onDeleteTask, onEditTask }: TaskColumnProps) {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Sort tasks by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder: { [key: string]: number } = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const startEditing = (taskText: string) => {
    setEditingTask(taskText);
    setEditValue(taskText);
  };

  const saveEdit = (originalText: string, category: 'Home' | 'Work' | 'School') => {
    if (editValue.trim() && editValue !== originalText) {
      onEditTask(originalText, category, editValue.trim());
    }
    setEditingTask(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditValue('');
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">{title}</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-6 text-sm">No tasks yet</p>
        ) : (
          sortedTasks.map((task, index) => (
            <Card key={index} className={`border-l-4 ${getBorderColor(task.priority)} hover:shadow-md transition-shadow`}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {editingTask === task.text ? (
                      <div className="space-y-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveEdit(task.text, task.category);
                            } else if (e.key === 'Escape') {
                              cancelEdit();
                            }
                          }}
                          className="text-sm sm:text-base"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => saveEdit(task.text, task.category)}
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
                          className="font-medium text-sm sm:text-base break-words cursor-pointer hover:text-primary transition-colors"
                          onDoubleClick={() => startEditing(task.text)}
                          title="Double-click to edit"
                        >
                          {task.text}
                        </span>
                        <div className="mt-2">
                          <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                            {getPriorityIcon(task.priority)} {task.priority}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  {editingTask !== task.text && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEditing(task.text)}
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm shrink-0"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDeleteTask(task.text, task.category)}
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
          ))
        )}
      </CardContent>
    </Card>
  );
}

function getBorderColor(priority: string): string {
  switch (priority) {
    case "High":
      return "border-l-red-500";
    case "Medium":
      return "border-l-yellow-500";
    case "Low":
      return "border-l-green-500";
    default:
      return "border-l-gray-300";
  }
}

function getPriorityVariant(priority: string): "default" | "secondary" | "destructive" | "outline" {
  switch (priority) {
    case "High":
      return "destructive";
    case "Medium":
      return "outline";
    case "Low":
      return "secondary";
    default:
      return "default";
  }
}

function getPriorityIcon(priority: string): string {
  switch (priority) {
    case "High":
      return "🔴";
    case "Medium":
      return "🟡";
    case "Low":
      return "🟢";
    default:
      return "⚪";
  }
}

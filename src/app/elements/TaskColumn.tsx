import { Task } from './Types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type TaskColumnProps = {
  title: string;
  tasks: Task[];
  onDeleteTask: (taskText: string, category: 'Home' | 'Work' | 'School') => void;
};

export default function TaskColumn({ title, tasks, onDeleteTask }: TaskColumnProps) {
  // Sort tasks by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder: { [key: string]: number } = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No tasks yet</p>
        ) : (
          sortedTasks.map((task, index) => (
            <Card key={index} className={`border-l-4 ${getBorderColor(task.priority)}`}>
              <CardContent className="flex justify-between items-center p-4">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">{task.text}</span>
                  <Badge variant={getPriorityVariant(task.priority)} className="w-fit">
                    {task.priority}
                  </Badge>
                </div>
                <Button
                  onClick={() => onDeleteTask(task.text, task.category)}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
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

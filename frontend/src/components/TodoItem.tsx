import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 bg-white p-4 rounded-lg shadow-card hover:shadow-hover transition-all duration-200 ${isDragging ? "opacity-50 scale-105" : ""
        } ${todo.completed ? "opacity-60" : ""}`}
    >
      {/* Drag Handle */}
      <button
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Checkbox */}
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="h-5 w-5"
      />

      {/* Editable Text */}
      {isEditing ? (
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
          className="flex-1 text-base"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 text-base ${todo.completed ? "line-through text-muted-foreground" : ""
            }`}
        >
          {todo.text}
        </span>
      )}

      {/* Edit / Save Button */}
      <Button
        //variant="ghost"
        size="icon"
        onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-700 bg-transparent"
      >
        {isEditing ? (
          <span><Check className="h-4 w-4 text-primary " /></span>
        ) : (
          <span><Pencil className="h-4 w-4 text-primary" /></span>
        )}
      </Button>

      {/* Delete Button */}
      <Button
        //variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700 bg-transparent  hover:bg-red-900"
      >
        <span><Trash2 className="h-4 w-4 text-red-500" /></span>
      </Button>
    </div>
  );
};

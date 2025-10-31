import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TodoItem } from "./TodoItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SuccessToast, ErrorToast } from "@/utils/toast-notification";
import useReactQuery from "@/hooks/useReactQuery";

type FilterType = "all" | "active" | "completed";

export interface Todo {
    uuid: string;
    title: string;
    description?: string | null;
    status: "pending" | "completed";
    position: number;
    started_at?: string | null;
    completed_at?: string | null;
    created_at: string;
}

export const TodoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [filter, setFilter] = useState<FilterType>("all");

    const { getQuery, postQuery, postRequestLoading } = useReactQuery();

    const { data, isLoading } = getQuery("todo");
    const todos: Todo[] = data?.data?.todos || [];

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const addTodo = () => {
        if (!inputValue.trim()) return;

        postQuery.mutate(
            {
                endpoint: "todo",
                payload: { title: inputValue.trim() },
                refreshEndpoint: "todo",
            },
            {
                onSuccess: () => {
                    setInputValue("");
                    SuccessToast("Todo added successfully");
                },
                onError: () => ErrorToast("Failed to add todo"),
            }
        );
    };

    const toggleTodo = (uuid: string, status: string) => {
        const newStatus = status === "completed" ? "active" : "completed";
        postQuery.mutate({
            endpoint: `todo/${uuid}/toggleCompleted`,
            refreshEndpoint: "todo",
        },
            {
                onSuccess: () => SuccessToast(`Todo marked as ${newStatus}`),
            });
    };

    const handleEditTodo = async (id: string, newText: string) => {
        await postQuery.mutateAsync({
            endpoint: `todo/update`,
            method: "POST",
            payload: { title: newText, uuid: id },
            refreshEndpoint: "todo",
        });
        SuccessToast("Todo updated");
    };

    const deleteTodo = (uuid: string) => {
        postQuery.mutate(
            {
                endpoint: `todo/${uuid}`,
                payload: { _method: "DELETE" },
                refreshEndpoint: "todo",
            },
            {
                onSuccess: () => SuccessToast("Todo deleted"),
            }
        );
    };

    const clearCompleted = () => {
        postQuery.mutate(
            {
                endpoint: "todo/clearCompleted",
                refreshEndpoint: "todo",
            },
            {
                onSuccess: () => SuccessToast("Cleared completed todos"),
            }
        );
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = todos.findIndex((t) => t.uuid === active.id) + 1;
        const newIndex = todos.findIndex((t) => t.uuid === over.id) + 1;

        try {
            postQuery.mutateAsync({
                endpoint: "todo/reorderPosition",
                payload: {
                    current_position: oldIndex,
                    new_position: newIndex,
                },
                refreshEndpoint: "todo",
            });
            SuccessToast("Todos reordered");
        } catch (error: any) {
            ErrorToast(error.message)
        }
    };

    const filteredTodos = todos.filter((todo) => {
        if (filter === "active") return todo.status !== "completed";
        if (filter === "completed") return todo.status === "completed";
        return true;
    });

    const total = data?.data?.total || 0;
    const totalActive = data?.data?.total_active || 0;
    const totalCompleted = data?.data?.total_completed || 0;

    if (isLoading)
        return <div className="text-center py-8">Loading todos...</div>;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-5xl font-bold text-primary">
                    Cornfield Todo Manager
                </h1>
                <p className="text-muted-foreground">
                    Organize your day, one task at a time
                </p>
            </div>

            {/* Add Todo */}
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    placeholder="What needs to be done?"
                    className="flex-1 h-12 text-base shadow-card"
                />
                <Button onClick={addTodo} className="h-12 px-6 pryBtn w-fit">
                    <Plus className="h-5 w-5 mr-2" />
                    Add
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-card">
                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "ghost"}
                        onClick={() => setFilter("all")}
                        className={filter === 'all' ? 'bg-secondary' : ''}
                    >
                        All ({total})
                    </Button>
                    <Button
                        variant={filter === "active" ? "default" : "ghost"}
                        onClick={() => setFilter("active")}
                        className={filter === 'active' ? 'bg-secondary' : ''}
                    >
                        Active ({totalActive})
                    </Button>
                    <Button
                        variant={filter === "completed" ? "default" : "ghost"}
                        onClick={() => setFilter("completed")}
                        className={filter === 'completed' ? 'bg-secondary' : ''}
                    >
                        Completed ({totalCompleted})
                    </Button>
                </div>
                {totalCompleted > 0 && (
                    <Button
                        variant="ghost"
                        onClick={clearCompleted}
                        className="text-primary w-fit bg-transparent hover:text-destructive hover:bg-destructive/10"
                    >
                        Clear Completed
                    </Button>
                )}
            </div>

            {/* Todo List */}
            {filteredTodos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-card">
                    <p className="text-muted-foreground text-lg">
                        {filter === "completed" && total > 0
                            ? "No completed tasks yet"
                            : filter === "active" && total > 0
                                ? "All tasks completed! 🎉"
                                : "No tasks yet. Add one to get started!"}
                    </p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={filteredTodos.map((t) => t.uuid)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {filteredTodos.map((todo) => (
                                <TodoItem
                                    key={todo.uuid}
                                    todo={{
                                        id: todo.uuid,
                                        text: todo.title,
                                        completed: todo.status === "completed",
                                    }}
                                    onToggle={() => toggleTodo(todo.uuid, todo.status)}
                                    onDelete={() => deleteTodo(todo.uuid)}
                                    onEdit={handleEditTodo}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
};

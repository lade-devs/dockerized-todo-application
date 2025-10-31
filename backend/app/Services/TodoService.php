<?php

namespace App\Services;

use App\Constants\TodoConstant;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use App\QueryBuilder\TodoQueryBuilder;
use Illuminate\Support\Facades\Validator;

class TodoService
{
    private function validate(array $data, $additionalRules = [])
    {
        $rules = array_merge([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ], $additionalRules);

        return Validator::make($data, $rules)->validate();
    }

    public function index()
    {
        $queryBuilder = new TodoQueryBuilder();

        return [
            'total' => Todo::count(),
            'total_active' => Todo::where('status', TodoConstant::ACTIVE)->count(),
            'total_completed' => Todo::where('status', TodoConstant::COMPLETED)->count(),
            'todos' => TodoResource::collection($queryBuilder->query(request())->get()),
        ];
    }

    public function store(array $data)
    {
        $fillable = $this->validate($data);

        $todo = Todo::create($fillable);

        return TodoResource::make($todo);
    }

    public function update(array $data)
    {
        $this->validate($data, [
            'uuid' => ['required', 'string', 'exists:todos,uuid'],
        ]);

        $todo = $this->getModel($data['uuid']);

        unset($data['uuid']);

        $todo->update($data);

        return TodoResource::make($todo->refresh());
    }

    public function delete($uuid)
    {
        $todo = $this->getModel($uuid);

        $position = $todo->position;

        $todo->delete();

        // Re-align remaining todos’ positions
        Todo::where('position', '>', $position)->decrement('position');

        return TodoResource::collection(Todo::orderBy('position')->get());
    }

    public function toggleCompleted($uuid)
    {
        $todo = $this->getModel($uuid);

        $isCompletetd = $todo->status == TodoConstant::COMPLETED;

        $todo->update([
            'status' => $isCompletetd ? TodoConstant::ACTIVE : TodoConstant::COMPLETED,
            'completed_at' => $isCompletetd ? null : now(),
        ]);

        return TodoResource::make($todo->refresh());
    }

    public function clearCompleted()
    {
        Todo::where('status', TodoConstant::COMPLETED)->delete();

        // Realign positions after clearing
        $remaining = Todo::orderBy('position')->get();

        foreach ($remaining as $index => $todo) {
            $todo->update(['position' => $index + 1]);
        }

        return TodoResource::collection(Todo::orderBy('position')->get());
    }

    public function reorderPosition(array $data)
    {
        Validator::make($data, [
            'current_position' => ['required', 'integer', 'exists:todos,position'],
            'new_position' => ['required', 'integer', 'exists:todos,position'],
        ])->validate();

        $current = Todo::where('position', $data['current_position'])->firstOrFail();
        $new = Todo::where('position', $data['new_position'])->firstOrFail();

        // Temporarily move current to avoid unique constraint clashes
        $current->update(['position' => 0]);

        // Swap positions
        $new->update(['position' => $data['current_position']]);
        $current->update(['position' => $data['new_position']]);

        return TodoResource::collection(Todo::orderBy('position')->get());
    }

    public function getModel(string $uuid): Todo|null
    {
        return Todo::where('uuid', $uuid)->firstOrFail();
    }
}
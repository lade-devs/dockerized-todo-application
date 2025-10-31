<?php

namespace Tests\Feature;

use App\Constants\TodoConstant;
use App\Models\Todo;
use Tests\TestCase;

class TodoTest extends TestCase
{
    public function test_that_todo_is_listed_successfully()
    {
        $todo = Todo::factory()->create();

        $response = $this->getJson('/api/v1/todo')
            ->assertJson([
                'status' => '200',
                'message' => 'Request processed successfully',
            ])
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'total',
                    'total_active',
                    'total_completed',
                    'todos' => [
                        [
                            'uuid',
                            'title',
                            'position',
                            'description',
                            'status',
                            'started_at',
                            'completed_at',
                            'created_at',
                        ],
                    ],
                ]
            ]);

        $this->assertEquals($todo->title, $response->json('data.todos.0.title'));
    }

    public function test_that_todo_can_be_created()
    {
        $this->post('/api/v1/todo', [
            'title' => 'Track operations'
        ]);

        $this->assertEquals(1, Todo::count());

        $this->assertEquals('Track operations', Todo::first()->title);
    }

    public function test_that_todo_can_be_updated()
    {
        $todo = Todo::factory()->create();

        $this->post("/api/v1/todo/update/", [
            'title' => 'New operations',
            'uuid' => $todo->uuid->toString(),
        ]);

        $this->assertEquals(1, Todo::count());

        $this->assertEquals('New operations', Todo::first()->title);
    }

    public function test_that_todo_can_be_deleted()
    {
        $todo = Todo::factory()->create();

        $this->delete("/api/v1/todo/{$todo->uuid->toString()}");

        $this->assertEquals(0, Todo::count());

        $this->assertEquals(1, Todo::onlyTrashed()->count());
    }

    public function test_that_todo_can_be_toggle_as_completed()
    {
        $todo = Todo::factory()->create();

        $this->post("/api/v1/todo/{$todo->uuid->toString()}/toggleCompleted");

        $this->assertEquals(TodoConstant::COMPLETED, $todo->refresh()->status);

        $this->assertNotNull($todo->refresh()->completed_at);
    }

    public function test_that_todo_can_be_toggle_as_not_completed()
    {
        $todo = Todo::factory()->create();

        $this->post("/api/v1/todo/{$todo->uuid->toString()}/toggleCompleted");

        $this->assertEquals(TodoConstant::COMPLETED, $todo->refresh()->status);

        $this->assertNotNull($todo->refresh()->completed_at);

         $this->post("/api/v1/todo/{$todo->uuid}/toggleCompleted");

        $this->assertEquals(TodoConstant::ACTIVE, $todo->refresh()->status);

        $this->assertNull($todo->refresh()->completed_at);
    }

    public function test_that_todo_can_be_cleared()
    {
        $todo = Todo::factory()->create();

        $this->post("/api/v1/todo/{$todo->uuid->toString()}/toggleCompleted");

        $this->post('/api/v1/todo/clearCompleted');

        $this->assertEquals(0, Todo::count());

        $this->assertEquals(1, Todo::onlyTrashed()->count());
    }

    public function test_that_todo_position_can_be_reordered()
    {
        $todos = Todo::factory()->count(4)->create();
        $response = $this->post('/api/v1/todo/reorderPosition', [
            'current_position' => 2,
            'new_position' => 1,
        ]);

        $response->assertStatus(200);

        $first = Todo::where('position', 1)->first();
        $second = Todo::where('position', 2)->first();

        // Assert swapped positions
        $this->assertNotEquals($first->id, $todos[0]->id);
        $this->assertNotEquals($second->id, $todos[1]->id);

        // Optional: assert order correctness
        $positions = Todo::orderBy('position')->pluck('position')->toArray();
        $this->assertEquals([1, 2, 3, 4], $positions);
    }
}
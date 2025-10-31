<?php

namespace App\QueryBuilder;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoQueryBuilder
{
    public function query(Request $request)
    {
        //set filter parameter
        $filterBy = $request->input('filter_by', 'all');

        return Todo::query()->when($filterBy, function ($query) use ($filterBy) {
            if ($filterBy == 'all')
                return $query;
            return $query->where('status', $filterBy);
        })->orderBy('position');
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FormTemplate;

class FormTemplateController extends Controller
{
    public function index()
    {
        return FormTemplate::all();
    }

    public function store(Request $request)
    {
        $template = FormTemplate::create($request->all());
        return response()->json($template, 201);
    }

    public function show(FormTemplate $template)
    {
        return $template;
    }

    public function update(Request $request, FormTemplate $template)
    {
        $template->update($request->all());
        return response()->json($template);
    }

    public function destroy(FormTemplate $template)
    {
        $template->delete();
        return response()->json(null, 204);
    }
}

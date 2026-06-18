<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormTemplate;
use App\Models\FormSubmission;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;

class FoodSafetySeeder extends Seeder
{
    public function run()
    {
        $admin = User::where('username', 'admin')->first();
        if (!$admin) {
            $admin = User::create([
                'username' => 'admin',
                'password' => bcrypt('password123'),
                'email' => 'admin@example.com',
                'is_superuser' => true
            ]);
        }

        // 1. Pest Control Template
        $pestTemplate = FormTemplate::firstOrCreate(
            ['name' => 'Pest Sighting Log'],
            [
                'department' => 'Operations',
                'schema' => [
                    'fields' => [
                        ['name' => 'date_of_sighting', 'label' => 'Date of Sighting', 'type' => 'date', 'required' => true],
                        ['name' => 'time', 'label' => 'Time', 'type' => 'text', 'required' => true],
                        ['name' => 'location_be_specific', 'label' => 'Location (be specific)', 'type' => 'text', 'required' => true],
                        ['name' => 'area_type_e.g.,_production,_storage,_office', 'label' => 'Area Type', 'type' => 'text', 'required' => true],
                    ]
                ],
                'version' => '1.0'
            ]
        );

        // 2. Temperature Template
        $tempTemplate = FormTemplate::firstOrCreate(
            ['name' => 'Temperature Log'],
            [
                'department' => 'Quality Control',
                'schema' => [
                    'fields' => [
                        ['name' => 'date', 'label' => 'Date', 'type' => 'date', 'required' => true],
                        ['name' => 'time', 'label' => 'Time', 'type' => 'text', 'required' => true],
                        ['name' => 'product_name', 'label' => 'Product Name', 'type' => 'text', 'required' => true],
                        ['name' => 'batch_number', 'label' => 'Batch Number', 'type' => 'text', 'required' => true],
                        ['name' => 'product_temp_°c', 'label' => 'Product Temp (°C)', 'type' => 'number', 'required' => true],
                        ['name' => 'vehicle_temp_°c', 'label' => 'Vehicle Temp (°C)', 'type' => 'number', 'required' => true],
                        ['name' => 'corrective_action_if_required', 'label' => 'Corrective Action', 'type' => 'textarea', 'required' => false],
                        ['name' => 'checked_by', 'label' => 'Checked By', 'type' => 'text', 'required' => true],
                    ]
                ],
                'version' => '1.0'
            ]
        );

        // 3. Cleaning Template
        $cleanTemplate = FormTemplate::firstOrCreate(
            ['name' => 'Cleaning Schedule Log'],
            [
                'department' => 'Sanitation',
                'schema' => [
                    'fields' => [
                        ['name' => 'date', 'label' => 'Date', 'type' => 'date', 'required' => true],
                        ['name' => 'cleaning_task', 'label' => 'Cleaning Task', 'type' => 'text', 'required' => true],
                        ['name' => 'assigned_to', 'label' => 'Assigned To', 'type' => 'text', 'required' => true],
                        ['name' => 'time_completed', 'label' => 'Time Completed', 'type' => 'text', 'required' => true],
                        ['name' => 'supervisor_sign_off', 'label' => 'Supervisor Sign Off', 'type' => 'text', 'required' => true],
                        ['name' => 'remarks', 'label' => 'Remarks', 'type' => 'textarea', 'required' => false],
                    ]
                ],
                'version' => '1.0'
            ]
        );

        $templates_to_seed = [
            [$pestTemplate, ["date_of_sighting" => "2026-02-26", "time" => "14:30", "location_be_specific" => "Storage Room B", "area_type_e.g.,_production,_storage,_office" => "Storage"]],
            [$pestTemplate, ["date_of_sighting" => "2026-02-20", "time" => "09:15", "location_be_specific" => "Loading Dock", "area_type_e.g.,_production,_storage,_office" => "Production"]],
            [$tempTemplate, ["date" => "2026-02-27", "time" => "08:00", "product_name" => "Chicken Breast", "batch_number" => "B-1029", "product_temp_°c" => 4, "vehicle_temp_°c" => 2, "corrective_action_if_required" => "None", "checked_by" => "John Doe"]],
            [$tempTemplate, ["date" => "2026-02-26", "time" => "18:00", "product_name" => "Milk", "batch_number" => "M-992", "product_temp_°c" => 6, "vehicle_temp_°c" => 5, "corrective_action_if_required" => "Relocated to cooler", "checked_by" => "Jane Smith"]],
            [$cleanTemplate, ["date" => "2026-02-27", "cleaning_task" => "Floor deep clean", "assigned_to" => "Cleaning Team A", "time_completed" => "22:00", "supervisor_sign_off" => "M. Scott", "remarks" => "Done well"]],
        ];

        FormSubmission::truncate();

        $count = 0;
        $statuses = ["Approved", "Pending", "Draft"];
        
        foreach ($templates_to_seed as $item) {
            $tmpl = $item[0];
            $data = $item[1];

            $status = $statuses[array_rand($statuses)];
            $subTime = Carbon::now()->subDays(rand(0, 7));
            
            $submissionData = [
                'form_id' => 'FS-' . Carbon::now()->format('iS') . '-' . $count,
                'template_id' => $tmpl->id,
                'employee_id' => $admin->id,
                'department' => 'Food Safety QoS',
                'status' => $status,
                'data' => ['rows' => [$data]], // Wrap in rows to match frontend list grid structure
                'created_at' => $subTime,
                'updated_at' => $subTime,
            ];

            if ($status === 'Approved') {
                $submissionData['approved_by'] = $admin->id;
                $submissionData['approved_at'] = Carbon::now();
            }

            FormSubmission::create($submissionData);
            $count++;
        }
    }
}

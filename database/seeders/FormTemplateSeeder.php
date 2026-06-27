<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormTemplate;

class FormTemplateSeeder extends Seeder
{
    public function run()
    {
        $templates = [
            [
                'name' => 'ASP001- Approved Supplier Matrix',
                'department' => 'Purchasing',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'suppliers',
                        'label' => 'Approved Suppliers',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'product', 'label' => 'Product', 'type' => 'text'],
                            ['name' => 'supplier', 'label' => 'Supplier', 'type' => 'text'],
                            ['name' => 'address', 'label' => 'Address', 'type' => 'text'],
                            ['name' => 'phone_fax', 'label' => 'Phone / Fax', 'type' => 'text'],
                            ['name' => 'contact_email', 'label' => 'Contact / Email', 'type' => 'text'],
                            ['name' => 'spec_sign_date', 'label' => 'Supplier Specification Sign Date', 'type' => 'date'],
                            ['name' => 'food_premises_reg', 'label' => 'Food Premises Reg./Licence No.', 'type' => 'text'],
                        ]
                    ]
                ]
            ],
            [
                'name' => 'RCV001- Receival Log',
                'department' => 'Receiving',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'receivals',
                        'label' => 'Receivals',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'time', 'label' => 'Time', 'type' => 'time'],
                            ['name' => 'product', 'label' => 'Product', 'type' => 'text'],
                            ['name' => 'supplier_invoice', 'label' => 'Supplier & Invoice or Docket No.', 'type' => 'text'],
                            ['name' => 'temp', 'label' => 'Temp of cold food (°C)', 'type' => 'number'],
                            ['name' => 'frozen_hard', 'label' => 'Frozen food hard frozen?', 'type' => 'boolean'],
                            ['name' => 'packaging_intact', 'label' => 'Packaging Intact?', 'type' => 'boolean'],
                            ['name' => 'within_use_by', 'label' => 'Within Use By / Best Before Date', 'type' => 'boolean'],
                            ['name' => 'accepted', 'label' => 'Product accepted?', 'type' => 'boolean'],
                            ['name' => 'rejected_reason', 'label' => 'If rejected, why?', 'type' => 'text'],
                            ['name' => 'signature', 'label' => 'Signature', 'type' => 'signature']
                        ]
                    ],
                    ['name' => 'vehicle_check_date', 'label' => 'Vehicle Check Date', 'type' => 'date'],
                    ['name' => 'company', 'label' => 'Company', 'type' => 'text'],
                    ['name' => 'vehicle_rego', 'label' => 'Vehicle Rego', 'type' => 'text'],
                    ['name' => 'vehicle_clean', 'label' => 'Vehicle clean?', 'type' => 'boolean'],
                    ['name' => 'correct_temp', 'label' => 'Correct Temp?', 'type' => 'boolean'],
                    ['name' => 'corrective_action_completed', 'label' => 'Corrective Action: Report completed?', 'type' => 'boolean'],
                    ['name' => 'driver_signed', 'label' => 'Driver Signed', 'type' => 'signature'],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                    ['name' => 'supervisor_signature', 'label' => 'Supervisor Signature', 'type' => 'signature'],
                ]
            ],
            [
                'name' => 'STO001- Weekly cold room/refrigerator temperature monitoring form',
                'department' => 'Storage',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'month', 'label' => 'Month', 'type' => 'text'],
                    ['name' => 'year', 'label' => 'Year', 'type' => 'number'],
                    ['name' => 'unit_location', 'label' => 'Unit/Location', 'type' => 'text'],
                    [
                        'name' => 'logs',
                        'label' => 'Temperature Logs',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'time', 'label' => 'Time', 'type' => 'time'],
                            ['name' => 'temp', 'label' => 'Temp (°C)', 'type' => 'number'],
                            ['name' => 'corrective_action', 'label' => 'Corrective Action (if needed)', 'type' => 'text'],
                            ['name' => 'checked_by', 'label' => 'Checked By', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date Checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'WSH001- Monthly fresh produce washing Log',
                'department' => 'Production',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'logs',
                        'label' => 'Washing Logs',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'produce', 'label' => 'Fresh produce to be washed', 'type' => 'text'],
                            ['name' => 'pass_fail', 'label' => 'Pass / Fail', 'type' => 'select', 'options' => ['Pass', 'Fail']],
                            ['name' => 'checked_by', 'label' => 'Checked By', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date Checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                    ['name' => 'supervisor_signature', 'label' => 'Supervisor Signature', 'type' => 'signature'],
                ]
            ],
            [
                'name' => 'PRO001- Daily Production Form- Momo',
                'department' => 'Production',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'month', 'label' => 'Month', 'type' => 'text'],
                    ['name' => 'year', 'label' => 'Year', 'type' => 'number'],
                    [
                        'name' => 'logs',
                        'label' => 'Production Logs',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'start_time', 'label' => 'Start Time', 'type' => 'time'],
                            ['name' => 'finish_time', 'label' => 'Finish Time', 'type' => 'time'],
                            ['name' => 'total_time', 'label' => 'Total time mince is exposed to ambient temperature (h)', 'type' => 'number'],
                            ['name' => 'exposure_more_than_2h', 'label' => 'Exposure time more than 2 hour', 'type' => 'boolean'],
                            ['name' => 'corrective_action', 'label' => 'Corrective Action (if needed)', 'type' => 'text'],
                            ['name' => 'checked_by', 'label' => 'Checked By', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date Checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'PRO002- Daily Production Form- Fried products',
                'department' => 'Production',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'month', 'label' => 'Month', 'type' => 'text'],
                    ['name' => 'year', 'label' => 'Year', 'type' => 'number'],
                    [
                        'name' => 'logs',
                        'label' => 'Frying Logs',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'frying_oil_temp', 'label' => 'Frying Oil Temperature', 'type' => 'number'],
                            ['name' => 'over_fried', 'label' => 'Is the product over-fried?', 'type' => 'boolean'],
                            ['name' => 'corrective_action', 'label' => 'Corrective Action (if needed)', 'type' => 'text'],
                            ['name' => 'checked_by', 'label' => 'Checked By', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date Checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'PRO003- Production Form- Pickles',
                'department' => 'Production',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'month', 'label' => 'Month', 'type' => 'text'],
                    ['name' => 'year', 'label' => 'Year', 'type' => 'number'],
                    [
                        'name' => 'logs',
                        'label' => 'Pickle Logs',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'ph', 'label' => 'pH of the pickle mix (bulk container)', 'type' => 'number'],
                            ['name' => 'covered_by_oil', 'label' => 'Is pickle covered by oil?', 'type' => 'boolean'],
                            ['name' => 'corrective_action', 'label' => 'Corrective Action (if needed)', 'type' => 'text'],
                            ['name' => 'checked_by', 'label' => 'Checked By', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date Checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'PRO004- Production Form- Sukuti (Dehydrated meat)',
                'department' => 'Production',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'logs',
                        'label' => 'Drying Logs',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'start_time', 'label' => 'Start time', 'type' => 'time'],
                            ['name' => 'end_time', 'label' => 'End time', 'type' => 'time'],
                            ['name' => 'drying_temp', 'label' => 'Drying Temperature', 'type' => 'number'],
                            ['name' => 'dried_enough', 'label' => 'Dried enough', 'type' => 'boolean'],
                            ['name' => 'corrective_action', 'label' => 'Corrective Action (if needed)', 'type' => 'text'],
                            ['name' => 'checked_by', 'label' => 'Checked By', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date Checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'MAI001- Preventative Maintenance and Equipment Repair Register',
                'department' => 'Maintenance',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'repairs',
                        'label' => 'Equipment Repairs',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'equipment', 'label' => 'Equipment', 'type' => 'text'],
                            ['name' => 'problem', 'label' => 'Nature of Problem', 'type' => 'text'],
                            ['name' => 'staff_action', 'label' => 'Staff Member taking Action', 'type' => 'text'],
                            ['name' => 'contractor_details', 'label' => 'Contractor Name and Contact', 'type' => 'text'],
                            ['name' => 'date_repair', 'label' => 'Date of Repair', 'type' => 'date'],
                            ['name' => 'action_taken', 'label' => 'Action Taken', 'type' => 'text'],
                            ['name' => 'contractor_report_file', 'label' => 'Contractor Report on file?', 'type' => 'boolean'],
                            ['name' => 'signed', 'label' => 'Signed', 'type' => 'signature'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date Checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'MAI002- Equipment Maintenance Schedule',
                'department' => 'Maintenance',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'schedule',
                        'label' => 'Maintenance Schedule',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'equipment', 'label' => 'Equipment', 'type' => 'text'],
                            ['name' => 'contractor_name', 'label' => 'Contractor Name (or Staff)', 'type' => 'text'],
                            ['name' => 'contractor_contact', 'label' => 'Contractor contact details', 'type' => 'text'],
                            ['name' => 'frequency', 'label' => 'Frequency of servicing', 'type' => 'text'],
                            ['name' => 'months_due', 'label' => 'Month/s due', 'type' => 'text'],
                            ['name' => 'actual_dates', 'label' => 'Actual Date/s', 'type' => 'text'],
                        ]
                    ]
                ]
            ],
            [
                'name' => 'DIS001- Dispatch Form',
                'department' => 'Dispatch',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'dispatches',
                        'label' => 'Dispatches',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'job_no', 'label' => 'Job No./Item', 'type' => 'text'],
                            ['name' => 'client', 'label' => 'Client', 'type' => 'text'],
                            ['name' => 'temp_dispatch', 'label' => 'TEMPERATURE (AT DISPATCH)', 'type' => 'number'],
                            ['name' => 'frozen_temp', 'label' => 'Temperature of frozen food -15°C', 'type' => 'boolean'],
                            ['name' => 'corrective_actions', 'label' => 'CORRECTIVE ACTIONS', 'type' => 'text'],
                            ['name' => 'signature', 'label' => 'Signature', 'type' => 'signature'],
                        ]
                    ]
                ]
            ],
            [
                'name' => 'DST001- Distribution temp monitoring',
                'department' => 'Distribution',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'monitoring',
                        'label' => 'Temp Monitoring',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'time', 'label' => 'Time', 'type' => 'time'],
                            ['name' => 'product_name', 'label' => 'Product Name', 'type' => 'text'],
                            ['name' => 'batch_number', 'label' => 'Batch Number', 'type' => 'text'],
                            ['name' => 'product_temp', 'label' => 'Product Temp (°C)', 'type' => 'number'],
                            ['name' => 'vehicle_temp', 'label' => 'Vehicle Temp (°C)', 'type' => 'number'],
                            ['name' => 'corrective_action', 'label' => 'Corrective Action (if required)', 'type' => 'text'],
                            ['name' => 'checked_by', 'label' => 'Checked By', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date Checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'GMP001- GMP and Maintenance internal audit',
                'department' => 'QA',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'personal_hygiene', 'label' => 'Are employees following personal hygiene protocols?', 'type' => 'boolean'],
                    ['name' => 'facility_cleanliness', 'label' => 'Is the facility clean and free of debris?', 'type' => 'boolean'],
                    ['name' => 'pest_control', 'label' => 'Are pest control measures in place and effective?', 'type' => 'boolean'],
                    ['name' => 'equipment_sanitation', 'label' => 'Is equipment cleaned and sanitized according to schedule?', 'type' => 'boolean'],
                    ['name' => 'waste_management', 'label' => 'Are waste disposal practices in compliance?', 'type' => 'boolean'],
                    ['name' => 'chemical_storage', 'label' => 'Are chemicals stored correctly?', 'type' => 'boolean'],
                    ['name' => 'equipment_maintenance', 'label' => 'Is all equipment maintained according to schedule?', 'type' => 'boolean'],
                    ['name' => 'maintenance_records', 'label' => 'Are maintenance records up-to-date and complete?', 'type' => 'boolean'],
                    ['name' => 'preventative_maintenance', 'label' => 'Is there a preventative maintenance schedule followed?', 'type' => 'boolean'],
                    ['name' => 'building_integrity', 'label' => 'Are there any structural issues or repairs needed?', 'type' => 'boolean'],
                    ['name' => 'calibration', 'label' => 'Are all instruments calibrated and functioning?', 'type' => 'boolean'],
                    ['name' => 'staff_training', 'label' => 'Are staff properly trained in GMP?', 'type' => 'boolean'],
                    ['name' => 'record_keeping', 'label' => 'Are GMP and maintenance records complete and accessible?', 'type' => 'boolean'],
                    ['name' => 'total_audited', 'label' => 'Total Items Audited', 'type' => 'number'],
                    ['name' => 'compliant_count', 'label' => 'Compliant Count', 'type' => 'number'],
                    ['name' => 'non_compliant_count', 'label' => 'Non-Compliant Count', 'type' => 'number'],
                    ['name' => 'major_findings', 'label' => 'Major Findings', 'type' => 'text'],
                    ['name' => 'minor_findings', 'label' => 'Minor Findings', 'type' => 'text'],
                    ['name' => 'corrective_actions_required', 'label' => 'Corrective Actions Required', 'type' => 'text'],
                    ['name' => 'responsible_person', 'label' => 'Responsible Person', 'type' => 'text'],
                    ['name' => 'target_completion_date', 'label' => 'Target Completion Date', 'type' => 'date'],
                    ['name' => 'follow_up_date', 'label' => 'Follow-Up Date', 'type' => 'date'],
                    ['name' => 'auditor_signature', 'label' => 'Auditor Signature', 'type' => 'signature'],
                    ['name' => 'auditor_date', 'label' => 'Auditor Date', 'type' => 'date'],
                    ['name' => 'supervisor_ack', 'label' => 'Supervisor Acknowledgment Signature', 'type' => 'signature'],
                    ['name' => 'supervisor_date', 'label' => 'Supervisor Date', 'type' => 'date'],
                ]
            ],
            [
                'name' => 'FSA001- Annual Food Safety Audit & Review',
                'department' => 'QA',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'audit_items',
                        'label' => 'Audit Items',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'section', 'label' => 'Section', 'type' => 'text'],
                            ['name' => 'audit_item', 'label' => 'Audit Item', 'type' => 'text'],
                            ['name' => 'compliant', 'label' => 'Compliant', 'type' => 'boolean'],
                            ['name' => 'findings', 'label' => 'Findings/Observations', 'type' => 'text'],
                            ['name' => 'corrective_action', 'label' => 'Corrective Action Required', 'type' => 'text'],
                            ['name' => 'responsible_person', 'label' => 'Responsible Person', 'type' => 'text'],
                            ['name' => 'completion_date', 'label' => 'Completion Date', 'type' => 'date'],
                        ]
                    ],
                    ['name' => 'total_audited', 'label' => 'Total Items Audited', 'type' => 'number'],
                    ['name' => 'compliant_count', 'label' => 'Compliant Count', 'type' => 'number'],
                    ['name' => 'non_compliant_count', 'label' => 'Non-Compliant Count', 'type' => 'number'],
                    ['name' => 'major_findings', 'label' => 'Major Findings', 'type' => 'text'],
                    ['name' => 'minor_findings', 'label' => 'Minor Findings', 'type' => 'text'],
                    ['name' => 'corrective_actions_req', 'label' => 'Corrective Actions Required', 'type' => 'text'],
                    ['name' => 'responsible_person', 'label' => 'Responsible Person', 'type' => 'text'],
                    ['name' => 'target_completion_date', 'label' => 'Target Completion Date', 'type' => 'date'],
                    ['name' => 'follow_up_date', 'label' => 'Follow-Up Date', 'type' => 'date'],
                    ['name' => 'recommendations', 'label' => 'Recommendations for Improvement', 'type' => 'text'],
                    ['name' => 'haccp_changes_needed', 'label' => 'Changes to HACCP/Food Safety Plans Needed?', 'type' => 'boolean'],
                    ['name' => 'haccp_details', 'label' => 'If Yes, Details', 'type' => 'text'],
                    ['name' => 'auditor_signature', 'label' => 'Auditor Signature', 'type' => 'signature'],
                    ['name' => 'auditor_date', 'label' => 'Date', 'type' => 'date'],
                    ['name' => 'supervisor_signature', 'label' => 'Supervisor/Manager Acknowledgment', 'type' => 'signature'],
                    ['name' => 'supervisor_date', 'label' => 'Date', 'type' => 'date'],
                ]
            ],
            [
                'name' => 'CAL001- Calibration Record',
                'department' => 'QA',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'records',
                        'label' => 'Calibration Records',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'thermometer_id', 'label' => 'Thermometer ID', 'type' => 'text'],
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'reading_100', 'label' => 'Boiling Water (100°C / ±1°C)', 'type' => 'number'],
                            ['name' => 'reading_0', 'label' => 'Iced Water (0°C / ±1°C)', 'type' => 'number'],
                            ['name' => 'corrective_action', 'label' => 'Corrective Action', 'type' => 'text'],
                            ['name' => 'initials', 'label' => 'Initials', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date Checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                    ['name' => 'supervisor_signature', 'label' => 'Signature', 'type' => 'signature'],
                ]
            ],
            [
                'name' => 'CAL002- Calibration Register',
                'department' => 'QA',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'registers',
                        'label' => 'Calibration Registers',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'unit_name', 'label' => 'Unit Name', 'type' => 'text'],
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'calibrated_reading', 'label' => 'Calibrated Thermometer Reading', 'type' => 'number'],
                            ['name' => 'unit_fixed_reading', 'label' => 'Unit\'s fixed Thermometer Reading', 'type' => 'number'],
                            ['name' => 'corrective_action', 'label' => 'Corrective Action', 'type' => 'text'],
                            ['name' => 'initials', 'label' => 'Initials', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Supervisor Date Checked', 'type' => 'date'],
                    ['name' => 'record_completed_correctly', 'label' => 'Record completed correctly?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions_taken', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                    ['name' => 'supervisor_signature', 'label' => 'Signature', 'type' => 'signature'],
                ]
            ],
            [
                'name' => 'PES001- Pest Sighting Report',
                'department' => 'Facility',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'date_sighting', 'label' => 'Date of Sighting', 'type' => 'date'],
                    ['name' => 'time_sighting', 'label' => 'Time', 'type' => 'time'],
                    ['name' => 'location', 'label' => 'Location', 'type' => 'text'],
                    ['name' => 'area_type', 'label' => 'Area Type', 'type' => 'text'],
                    ['name' => 'pest_type', 'label' => 'Type of Pest Observed', 'type' => 'select', 'options' => ['Rodent', 'Cockroach', 'Flying Insect', 'Crawling Insect', 'Bird', 'Other']],
                    ['name' => 'other_pest', 'label' => 'If Other, specify', 'type' => 'text'],
                    ['name' => 'number_seen', 'label' => 'Number Seen', 'type' => 'number'],
                    ['name' => 'condition', 'label' => 'Condition (Alive/Dead)', 'type' => 'select', 'options' => ['Alive', 'Dead']],
                    ['name' => 'observed_activity', 'label' => 'Observed Activity', 'type' => 'text'],
                    ['name' => 'reporter_name', 'label' => 'Name of Reporter', 'type' => 'text'],
                    ['name' => 'reporter_position', 'label' => 'Position', 'type' => 'text'],
                    ['name' => 'reporter_signature', 'label' => 'Reporter Signature', 'type' => 'signature'],
                    ['name' => 'immediate_action', 'label' => 'Immediate Action Taken', 'type' => 'text'],
                    ['name' => 'action_by', 'label' => 'By Whom', 'type' => 'text'],
                    ['name' => 'action_date', 'label' => 'Date', 'type' => 'date'],
                    ['name' => 'contractor_notified', 'label' => 'Was Contractor Notified?', 'type' => 'boolean'],
                    ['name' => 'contractor_details', 'label' => 'If Yes, Contractor & Date', 'type' => 'text'],
                    ['name' => 'supervisor_comments', 'label' => 'Comments/Corrective Actions Required', 'type' => 'text'],
                    ['name' => 'supervisor_reviewed_by', 'label' => 'Reviewed By', 'type' => 'text'],
                    ['name' => 'supervisor_signature', 'label' => 'Supervisor Signature', 'type' => 'signature'],
                    ['name' => 'supervisor_date', 'label' => 'Date', 'type' => 'date'],
                ]
            ],
            [
                'name' => 'L&D001- Education Attendance Record',
                'department' => 'HR',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'attendance',
                        'label' => 'Attendance Records',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'staff_name', 'label' => 'Staff Name', 'type' => 'text'],
                            ['name' => 'position', 'label' => 'Position', 'type' => 'text'],
                            ['name' => 'qualifications', 'label' => 'Qualifications (Topic/Title)', 'type' => 'text'],
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'trainee_signature', 'label' => 'Trainee Signature', 'type' => 'signature'],
                        ]
                    ]
                ]
            ],
            [
                'name' => 'L&D002- Refresher Training Register',
                'department' => 'HR',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'refreshers',
                        'label' => 'Refresher Training',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'staff_name', 'label' => 'Staff Name', 'type' => 'text'],
                            ['name' => 'position', 'label' => 'Position', 'type' => 'text'],
                            ['name' => 'training_title', 'label' => 'Qualifications/Training Title', 'type' => 'text'],
                            ['name' => 'initial_training_date', 'label' => 'Initial training date', 'type' => 'date'],
                            ['name' => 'refresher_training_date', 'label' => 'Refresher Training Date', 'type' => 'date'],
                            ['name' => 'signature', 'label' => 'Signature', 'type' => 'signature'],
                        ]
                    ]
                ]
            ],
            [
                'name' => 'AME001- Document Control Register',
                'department' => 'QA',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'documents',
                        'label' => 'Documents',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'document_title', 'label' => 'Document Title', 'type' => 'text'],
                            ['name' => 'document_code', 'label' => 'Document Code', 'type' => 'text'],
                            ['name' => 'version_number', 'label' => 'Version Number', 'type' => 'text'],
                            ['name' => 'date_issue', 'label' => 'Date of Issue', 'type' => 'date'],
                            ['name' => 'reviewed_by', 'label' => 'Reviewed By', 'type' => 'text'],
                            ['name' => 'next_review_date', 'label' => 'Next Review Date', 'type' => 'date'],
                            ['name' => 'status', 'label' => 'Status (Active/Obsolete)', 'type' => 'text'],
                            ['name' => 'remarks', 'label' => 'Remarks', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'reviewed_by_manager', 'label' => 'Reviewed by', 'type' => 'text']
                ]
            ],
            [
                'name' => 'VIS001 - Visitor Entry Policy Acknowledgment',
                'department' => 'Facility',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                    ['name' => 'visitor_name', 'label' => 'Visitor Name', 'type' => 'text'],
                    ['name' => 'acknowledged', 'label' => 'I have read and understood the Visitor Entry Policy', 'type' => 'boolean'],
                    ['name' => 'visitor_signature', 'label' => 'Visitor Signature', 'type' => 'signature'],
                ]
            ],
            [
                'name' => 'VIS002 - Food Handler Entry Policy Acknowledgment',
                'department' => 'Facility',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                    ['name' => 'handler_name', 'label' => 'Food Handler Name', 'type' => 'text'],
                    ['name' => 'acknowledged', 'label' => 'I have read and understood the Food Handler Entry Policy', 'type' => 'boolean'],
                    ['name' => 'handler_signature', 'label' => 'Signature', 'type' => 'signature'],
                ]
            ],
            [
                'name' => 'CAR001 - Corrective Action Request Form',
                'department' => 'QA',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'date_issue', 'label' => 'Date of Issue', 'type' => 'date'],
                    ['name' => 'reported_by', 'label' => 'Reported By', 'type' => 'text'],
                    ['name' => 'department_origin', 'label' => 'Department', 'type' => 'text'],
                    ['name' => 'non_conformance_desc', 'label' => 'Description of Non-Conformance', 'type' => 'text'],
                    ['name' => 'immediate_action', 'label' => 'Immediate Action Taken', 'type' => 'text'],
                    ['name' => 'investigated_by', 'label' => 'Investigated By', 'type' => 'text'],
                    ['name' => 'root_cause', 'label' => 'Root Cause', 'type' => 'text'],
                    ['name' => 'proposed_action', 'label' => 'Proposed Corrective Action', 'type' => 'text'],
                    ['name' => 'responsible_person', 'label' => 'Responsible Person', 'type' => 'text'],
                    ['name' => 'target_completion_date', 'label' => 'Target Completion Date', 'type' => 'date'],
                    ['name' => 'verified_by', 'label' => 'Verified By', 'type' => 'text'],
                    ['name' => 'verification_method', 'label' => 'Verification Method', 'type' => 'text'],
                    ['name' => 'is_resolved', 'label' => 'Is the issue resolved?', 'type' => 'boolean'],
                    ['name' => 'further_actions', 'label' => 'If No, further actions required', 'type' => 'text'],
                    ['name' => 'approved_by', 'label' => 'Approved by', 'type' => 'text'],
                    ['name' => 'approved_date', 'label' => 'Date', 'type' => 'date'],
                    ['name' => 'reviewed_by', 'label' => 'Reviewed by', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'CLE001- Production Area Daily Cleaning Sign off',
                'department' => 'Sanitation',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'daily_cleaning',
                        'label' => 'Daily Cleaning Tasks',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'task', 'label' => 'Cleaning Task', 'type' => 'select', 'options' => ['Cleaning of floors', 'Cleaning of equipment surfaces', 'Sanitizing workstations', 'Cleaning of high-touch areas', 'Waste removal']],
                            ['name' => 'assigned_to', 'label' => 'Assigned To', 'type' => 'text'],
                            ['name' => 'time_completed', 'label' => 'Time Completed', 'type' => 'time'],
                            ['name' => 'supervisor_sign', 'label' => 'Supervisor Sign Off', 'type' => 'signature'],
                            ['name' => 'remarks', 'label' => 'Remarks', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Date Checked', 'type' => 'date'],
                    ['name' => 'daily_completed', 'label' => 'Daily Cleaning Completed?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'CLE002- Production Area Weekly Cleaning Sign off',
                'department' => 'Sanitation',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'weekly_cleaning',
                        'label' => 'Weekly Cleaning Tasks',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'week_starting', 'label' => 'Week Starting Date', 'type' => 'date'],
                            ['name' => 'task', 'label' => 'Cleaning Task', 'type' => 'select', 'options' => ['Deep cleaning of equipment', 'Cleaning of walls and ceilings', 'Cleaning of storage areas', 'Descaling and sanitizing drains', 'Thorough waste area cleaning']],
                            ['name' => 'assigned_to', 'label' => 'Assigned To', 'type' => 'text'],
                            ['name' => 'time_completed', 'label' => 'Time Completed', 'type' => 'time'],
                            ['name' => 'supervisor_sign', 'label' => 'Supervisor Sign Off', 'type' => 'signature'],
                            ['name' => 'remarks', 'label' => 'Remarks', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Date Checked', 'type' => 'date'],
                    ['name' => 'weekly_completed', 'label' => 'Weekly Cleaning Completed?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'CLE003- Dishwasher Temperature Monitoring',
                'department' => 'Sanitation',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'dishwasher_logs',
                        'label' => 'Dishwasher Logs',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'time', 'label' => 'Time', 'type' => 'time'],
                            ['name' => 'load_number', 'label' => 'Load Number', 'type' => 'number'],
                            ['name' => 'wash_temp', 'label' => 'Wash Temp (°C)', 'type' => 'number'],
                            ['name' => 'rinse_temp', 'label' => 'Rinse Temp (°C)', 'type' => 'number'],
                            ['name' => 'recorded_by', 'label' => 'Recorded By', 'type' => 'text'],
                            ['name' => 'remarks', 'label' => 'Remarks', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'supervisor_date_checked', 'label' => 'Date Checked', 'type' => 'date'],
                    ['name' => 'weekly_completed', 'label' => 'Weekly Cleaning Completed?', 'type' => 'boolean'],
                    ['name' => 'corrective_actions', 'label' => 'If "No", Corrective Actions Taken', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'CLE004 - Robot Coupe Cleaning Instruction Acknowledgment',
                'department' => 'Sanitation',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                    ['name' => 'staff_name', 'label' => 'Staff Name', 'type' => 'text'],
                    ['name' => 'acknowledged', 'label' => 'I have read and understood the cleaning instructions', 'type' => 'boolean'],
                    ['name' => 'staff_signature', 'label' => 'Signature', 'type' => 'signature'],
                ]
            ],
            [
                'name' => 'CLE006- Stick Blender Cleaning Instruction Acknowledgment',
                'department' => 'Sanitation',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                    ['name' => 'staff_name', 'label' => 'Staff Name', 'type' => 'text'],
                    ['name' => 'acknowledged', 'label' => 'I have read and understood the cleaning instructions', 'type' => 'boolean'],
                    ['name' => 'staff_signature', 'label' => 'Signature', 'type' => 'signature'],
                ]
            ],
            [
                'name' => 'TRA001 - Induction Booklet Acknowledgment',
                'department' => 'HR',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                    ['name' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text'],
                    ['name' => 'acknowledged', 'label' => 'I confirm receipt and understanding of the induction booklet', 'type' => 'boolean'],
                    ['name' => 'employee_signature', 'label' => 'Employee Signature', 'type' => 'signature'],
                    ['name' => 'approved_by', 'label' => 'Approved By', 'type' => 'text'],
                ]
            ],
            [
                'name' => 'GLA001- Glass/Crockery Breakage Register',
                'department' => 'Facility',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'breakages',
                        'label' => 'Breakage Log',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'date', 'label' => 'Date', 'type' => 'date'],
                            ['name' => 'time', 'label' => 'Time', 'type' => 'time'],
                            ['name' => 'location', 'label' => 'Location', 'type' => 'text'],
                            ['name' => 'item_broken', 'label' => 'Item Broken', 'type' => 'text'],
                            ['name' => 'quantity', 'label' => 'Quantity', 'type' => 'number'],
                            ['name' => 'action_taken', 'label' => 'Action Taken', 'type' => 'text'],
                            ['name' => 'recorded_by', 'label' => 'Recorded By', 'type' => 'text'],
                            ['name' => 'supervisor_sign', 'label' => 'Supervisor Sign Off', 'type' => 'signature'],
                            ['name' => 'remarks', 'label' => 'Remarks', 'type' => 'text'],
                        ]
                    ]
                ]
            ],
            [
                'name' => 'HAC001- Annual Food Safety Audit & Review Register',
                'department' => 'QA',
                'version' => '1.0',
                'issue_date' => '2024-08-14',
                'schema' => [
                    [
                        'name' => 'audit_records',
                        'label' => 'Audit Log',
                        'type' => 'table',
                        'columns' => [
                            ['name' => 'audit_date', 'label' => 'Audit Date', 'type' => 'date'],
                            ['name' => 'auditor_name', 'label' => 'Auditor Name', 'type' => 'text'],
                            ['name' => 'audit_scope', 'label' => 'Audit Scope', 'type' => 'text'],
                            ['name' => 'key_findings', 'label' => 'Key Findings', 'type' => 'text'],
                            ['name' => 'corrective_actions', 'label' => 'Corrective Actions Required', 'type' => 'text'],
                            ['name' => 'responsible_person', 'label' => 'Responsible Person', 'type' => 'text'],
                            ['name' => 'completion_date', 'label' => 'Completion Date', 'type' => 'date'],
                            ['name' => 'follow_up_date', 'label' => 'Follow-Up Date', 'type' => 'date'],
                            ['name' => 'remarks', 'label' => 'Remarks', 'type' => 'text'],
                        ]
                    ],
                    ['name' => 'total_audited', 'label' => 'Total Audits Conducted', 'type' => 'number'],
                    ['name' => 'major_non_conf', 'label' => 'Major Non-Conformances', 'type' => 'number'],
                    ['name' => 'minor_non_conf', 'label' => 'Minor Non-Conformances', 'type' => 'number'],
                    ['name' => 'compliance_rating', 'label' => 'Overall Compliance Rating', 'type' => 'text'],
                ]
            ]
        ];

        foreach ($templates as $t) {
            FormTemplate::updateOrCreate(
                ['name' => $t['name']],
                $t
            );
        }
    }
}

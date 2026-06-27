<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $submission->template->name }}</title>
    <style>
        @page {
            margin: 40px;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0 0 5px 0;
            font-size: 18px;
            text-transform: uppercase;
        }
        .field-group {
            margin-bottom: 10px;
            page-break-inside: avoid;
        }
        .field-label {
            font-weight: bold;
        }
        .field-value {
            border-bottom: 1px solid #000;
            display: inline-block;
            min-width: 200px;
            padding-left: 5px;
        }
        .table-container {
            margin-top: 15px;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .signature-box {
            margin-top: 30px;
            page-break-inside: avoid;
            float: left;
            margin-right: 50px;
        }
        .signature-line {
            width: 250px;
            border-bottom: 1px solid #000;
            margin-top: 40px;
            margin-bottom: 5px;
        }
        .checkbox-container {
            display: inline-block;
            margin-right: 15px;
        }
        .check-box {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 1px solid #000;
            text-align: center;
            line-height: 12px;
            margin-right: 5px;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
    </style>
</head>
<body>
    @php
        $schemaStr = $submission->template->schema;
        $schema = is_string($schemaStr) ? json_decode($schemaStr, true) : $schemaStr;
        if (!$schema) $schema = [];
        $data = $submission->data ?? [];
    @endphp

    <table style="width: 100%; border: none; margin-bottom: 10px;">
        <tr>
            <td style="width: 50%; border: none; padding: 0; vertical-align: bottom;">
                <img src="{{ public_path('images/logo.png') }}" style="max-height: 80px;" alt="Logo" />
            </td>
            <td style="width: 50%; border: none; padding: 0; text-align: right; vertical-align: bottom; font-family: Arial, sans-serif; font-size: 14px; color: #333; font-weight: bold;">
                Food Safety Program &ndash; Neps Food
            </td>
        </tr>
    </table>
    
    <div style="border-top: 2px solid #000; margin-bottom: 20px;"></div>

    <h2 style="margin: 0 0 20px 0; font-size: 18px; text-align: left; font-family: Arial, sans-serif; color: #000;">
        {{ $submission->template->name }}
    </h2>

    @foreach($schema as $field)
        @php
            $fieldName = $field['name'] ?? null;
            if (!$fieldName) continue;
            $value = $data[$fieldName] ?? null;
        @endphp

        @if($field['type'] === 'text' || $field['type'] === 'date' || $field['type'] === 'select')
            <div class="field-group">
                <span class="field-label">{{ $field['label'] }}:</span>
                <span class="field-value">{{ is_array($value) ? implode(', ', $value) : $value }}</span>
            </div>

        @elseif($field['type'] === 'checkbox')
            <div class="field-group">
                <div class="field-label">{{ $field['label'] }}</div>
                <div style="margin-top: 5px;">
                    @if(isset($field['options']) && is_array($field['options']))
                        @foreach($field['options'] as $option)
                            @php
                                $isChecked = is_array($value) ? in_array($option, $value) : $value === $option;
                            @endphp
                            <div class="checkbox-container">
                                <span class="check-box">{{ $isChecked ? 'X' : '&nbsp;&nbsp;' }}</span>
                                <span>{{ $option }}</span>
                            </div>
                        @endforeach
                    @endif
                </div>
            </div>

        @elseif($field['type'] === 'table')
            <div class="table-container">
                <div class="field-label" style="margin-bottom: 5px;">{{ $field['label'] }}</div>
                <table>
                    <thead>
                        <tr>
                            @foreach($field['columns'] as $col)
                                <th>{{ $col['label'] }}</th>
                            @endforeach
                        </tr>
                    </thead>
                    <tbody>
                        @if(is_array($value) && count($value) > 0)
                            @foreach($value as $row)
                                <tr>
                                    @foreach($field['columns'] as $col)
                                        <td>{{ $row[$col['name']] ?? '' }}</td>
                                    @endforeach
                                </tr>
                            @endforeach
                        @else
                            {{-- Print 5 empty rows for manual filling if no data --}}
                            @for($i = 0; $i < 5; $i++)
                                <tr>
                                    @foreach($field['columns'] as $col)
                                        <td style="height: 20px;"></td>
                                    @endforeach
                                </tr>
                            @endfor
                        @endif
                    </tbody>
                </table>
            </div>

        @elseif($field['type'] === 'signature')
            <div class="signature-box">
                <div class="field-label">{{ $field['label'] }}</div>
                @if($value && is_string($value) && str_starts_with($value, 'data:image'))
                    <div style="margin-top: 10px;">
                        <img src="{{ $value }}" style="max-height: 80px; max-width: 250px;" />
                    </div>
                    <div style="width: 250px; border-bottom: 1px solid #000; margin-top: 5px;"></div>
                @else
                    <div class="signature-line"></div>
                @endif
                <div style="font-size: 10px; margin-top: 3px;">Sign above</div>
            </div>
        @endif

    @endforeach

    <div class="clearfix"></div>

    <div style="margin-top: 40px; font-size: 10px; border-top: 1px solid #000; padding-top: 5px; color: #005A9C; font-family: Arial, sans-serif;">
        <div>Neps Foods | Version {{ $submission->template->version ?? '1.0' }}</div>
        <div>Issue Date: {{ $submission->template->issue_date ? $submission->template->issue_date->format('d M Y') : '14 Aug 2024' }}</div>
    </div>

</body>
</html>

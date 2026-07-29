<?php

namespace App\Services;

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Shared\Html;

class DocumentExportService
{
    public static function generateWord(string $title, string $htmlContent, string $filename): \Illuminate\Http\Response
    {
        $phpWord = new PhpWord();
        $section = $phpWord->addSection([
            'marginLeft' => 1440,
            'marginRight' => 1440,
            'marginTop' => 1440,
            'marginBottom' => 1440,
        ]);

        $header = $section->addHeader();
        $header->addText(
            "RÉPUBLIQUE DÉMOCRATIQUE DU CONGO\nUNIVERSITÉ ADVENTISTE DE LUKANGA\nFaculté des Sciences et Technologies",
            ['name' => 'DejaVu Sans', 'size' => 9, 'bold' => true, 'color' => '0f766e'],
            ['align' => 'center']
        );
        $header->addText(
            '"Scio ut sim" — Je sais pour être',
            ['name' => 'DejaVu Sans', 'size' => 8, 'italic' => true, 'color' => '64748b'],
            ['align' => 'center']
        );

        $section->addTextBreak(1);
        $section->addText(
            strtoupper($title),
            ['name' => 'DejaVu Sans', 'size' => 14, 'bold' => true],
            ['align' => 'center']
        );
        $section->addTextBreak(1);

        Html::addHtml($section, $htmlContent, false);

        $footer = $section->addFooter();
        $footer->addText(
            "UNILUK — Document officiel généré le " . now()->format('d/m/Y à H:i'),
            ['name' => 'DejaVu Sans', 'size' => 8, 'color' => '94a3b8'],
            ['align' => 'center']
        );

        $tempPath = storage_path('app/temp_' . uniqid() . '.docx');
        $writer = IOFactory::createWriter($phpWord, 'Word2007');
        $writer->save($tempPath);

        return response()->download($tempPath, $filename . '.docx')->deleteFileAfterSend(true);
    }

    public static function renderHtmlTable(array $headers, array $rows, array $options = []): string
    {
        $style = $options['tableStyle'] ?? 'border:1px solid #cbd5e1;border-collapse:collapse;width:100%;font-size:10px;';
        $thStyle = $options['thStyle'] ?? 'background:#f1f5f9;padding:5px 7px;text-align:left;font-weight:bold;font-size:9px;';
        $tdStyle = $options['tdStyle'] ?? 'border:1px solid #cbd5e1;padding:4px 6px;';

        $html = '<table style="' . $style . '"><thead><tr>';
        foreach ($headers as $h) {
            $html .= '<th style="' . $thStyle . '">' . e($h) . '</th>';
        }
        $html .= '</tr></thead><tbody>';
        foreach ($rows as $row) {
            $html .= '<tr>';
            foreach ($row as $cell) {
                $html .= '<td style="' . $tdStyle . '">' . $cell . '</td>';
            }
            $html .= '</tr>';
        }
        $html .= '</tbody></table>';
        return $html;
    }
}

import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, format = 'csv', filename = 'export' } = body;

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    if (format === 'csv') {
      // Convert to CSV
      const csv = Papa.unparse(data, {
        header: true,
        skipEmptyLines: true,
      });

      // Return CSV file
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      });
    } else if (format === 'json') {
      // Return JSON file
      const json = JSON.stringify(data, null, 2);

      return new NextResponse(json, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}.json"`,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Use "csv" or "json"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if API is working
export async function GET() {
  return NextResponse.json({
    message: 'Export API is ready',
    supportedFormats: ['csv', 'json'],
  });
}
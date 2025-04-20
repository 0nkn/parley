import { NextRequest, NextResponse } from 'next/server';

// Simple test endpoint to verify server functionality
export async function GET() {
  try {
    return NextResponse.json({
      status: 'success',
      message: 'API server is working properly',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
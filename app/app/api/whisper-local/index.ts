import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

// Interface for transcription parameters
export interface LocalWhisperParams {
  audioData: Buffer;
  language?: string;
  model?: 'tiny' | 'base' | 'small' | 'medium' | 'large';
}

/**
 * Transcribes speech using locally installed Whisper
 * Requires whisper to be installed on the server
 * Installation: pip install git+https://github.com/openai/whisper.git
 */
export async function transcribeSpeechLocally(
  params: LocalWhisperParams
): Promise<string> {
  const { audioData, language, model = 'tiny' } = params;
  
  // Create temporary file
  const tempDir = os.tmpdir();
  const audioId = uuidv4();
  const audioPath = path.join(tempDir, `${audioId}.wav`);
  
  try {
    // Write audio data to temporary file
    await writeFile(audioPath, audioData);
    
    // Get the base path of the application
    const appRoot = process.cwd();
    
    // Try different possible paths for the whisper command
    const possibleCommands = [
      // Use local whisper wrapper script if it exists
      path.join(appRoot, 'whisper-wrapper.sh'),
      // Try absolute path that user may have set up
      '/path/to/your/venv/bin/whisper',
      // Try standard commands
      'whisper',
      'python -m whisper'
    ];
    
    let transcription = '';
    let succeeded = false;
    
    // Try each command until one works
    for (const cmdBase of possibleCommands) {
      if (succeeded) break;
      
      try {
        // Build command
        let command = `${cmdBase} "${audioPath}" --model ${model}`;
        if (language) {
          command += ` --language ${language}`;
        }
        
        console.log(`Trying command: ${command}`);
        
        // Use exec for simpler handling
        transcription = await new Promise((resolve, reject) => {
          exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
            if (error) {
              console.error(`Command '${cmdBase}' failed:`, error);
              console.error('Stderr:', stderr);
              reject(error);
              return;
            }
            
            // Process stdout to extract actual transcription
            const lines = stdout.split('\n');
            let result = '';
            
            for (const line of lines) {
              // Skip information/metadata lines
              if (line && !line.includes('Detected language:') && 
                  !line.includes('Detecting language') && 
                  !line.includes('--language')) {
                result += line + ' ';
              }
            }
            
            resolve(result.trim() || 'No speech detected');
          });
        });
        
        // If we get here, the command succeeded
        console.log(`Command '${cmdBase}' succeeded!`);
        succeeded = true;
        
      } catch (cmdError) {
        console.log(`Command '${cmdBase}' failed, trying next option...`);
        // Continue to the next command
      }
    }
    
    if (!succeeded) {
      throw new Error('All whisper command options failed');
    }
    
    return transcription;
  } catch (error) {
    console.error('Error in local speech transcription:', error);
    throw error instanceof Error ? error : new Error('Unknown error in speech transcription');
  }
}

/**
 * API route handler for speech-to-text using local Whisper
 */
export async function POST(request: Request) {
  try {
    console.log('Whisper local API called');
    
    // Get the FormData from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || undefined;
    const model = (formData.get('model') as 'tiny' | 'base' | 'small' | 'medium' | 'large') || 'tiny';
    
    if (!audioFile) {
      console.error('No audio file provided');
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }
    
    console.log(`Audio file received: ${audioFile.size} bytes`);
    
    // Convert file to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Process with local Whisper
    try {
      console.log('Calling local Whisper transcription');
      const transcribedText = await transcribeSpeechLocally({
        audioData: buffer,
        language,
        model
      });
      
      console.log('Transcription result:', transcribedText);
      return NextResponse.json({ text: transcribedText || 'No speech detected' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error in speech transcription';
      console.error('Local speech-to-text error:', errorMessage);
      
      // Try to fallback to simpler command if the first one failed
      try {
        console.log('Trying fallback transcription method');
        // Write to a temp file
        const tempDir = os.tmpdir();
        const audioId = uuidv4();
        const audioPath = path.join(tempDir, `${audioId}.wav`);
        await writeFile(audioPath, buffer);
        
        // Try Python directly with a simplified command
        const command = `python -m whisper "${audioPath}" --model tiny`;
        
        const transcribedText = await new Promise<string>((resolve, reject) => {
          exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
            if (error) {
              reject(new Error(`Python whisper command failed: ${error.message}`));
              return;
            }
            
            // Return any text we can find
            resolve(stdout.trim() || stderr.trim() || 'No speech detected');
          });
        });
        
        console.log('Fallback transcription result:', transcribedText);
        return NextResponse.json({ text: transcribedText });
      } catch (fallbackError) {
        console.error('Fallback transcription also failed:', fallbackError);
        return NextResponse.json({
          error: errorMessage,
          type: 'whisper_local_error'
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Request handling error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error processing speech-to-text request',
      type: 'request_error'
    }, { status: 500 });
  }
} 
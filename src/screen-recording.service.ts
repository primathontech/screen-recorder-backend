import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
// import { exec } from 'child_process';

interface VideoChunk {
  callId: string;
  chunk: Buffer;
  timestamp: number;
}

@Injectable()
export class ScreenRecordingService {
  private recordingFolderPath = path.join(process.cwd(), 'recordings');

  constructor() {
    // Ensure recordings directory exists
    fs.mkdirpSync(this.recordingFolderPath);
  }

  async saveVideoChunk(videoChunk: VideoChunk): Promise<string> {
    const callRecordingDir = path.join(
      this.recordingFolderPath, 
      videoChunk.callId
    );

    // Create call-specific directory
    fs.mkdirSync(callRecordingDir, { recursive: true });

    // Generate unique filename for chunk
    const chunkFilename = path.join(
      callRecordingDir, 
      `chunk_${videoChunk.timestamp}.webm`
    );

    // Save chunk
    await fs.writeFile(chunkFilename, Buffer.from(videoChunk.chunk));

    return chunkFilename;
  }

  // async mergeVideoChunks(callId: string): Promise<string> {
  //   const callRecordingDir = path.join(
  //     this.recordingFolderPath, 
  //     callId
  //   );

  //   // Get all chunks sorted by timestamp
  //   const chunks = (await fs.readdir(callRecordingDir))
  //     .filter(file => file.startsWith('chunk_'))
  //     .sort((a, b) => {
  //       const timestampA = parseInt(a.split('_')[1].split('.')[0]);
  //       const timestampB = parseInt(b.split('_')[1].split('.')[0]);
  //       return timestampA - timestampB;
  //     });

  //   // Final merged video path
  //   const mergedVideoPath = path.join(
  //     this.recordingFolderPath, 
  //     `${callId}_${Date.now()}.webm`
  //   );

  //   // Create chunk list file for ffmpeg
  //   const chunkListPath = path.join(callRecordingDir, 'chunk_list.txt');
  //   const chunkListContent = chunks
  //     .map(chunk => `file '${path.join(callRecordingDir, chunk)}'`)
  //     .join('\n');
    
  //   await fs.writeFile(chunkListPath, chunkListContent);

  //   // Merge chunks using ffmpeg
  //   return new Promise((resolve, reject) => {
  //     exec(
  //       `ffmpeg -f concat -safe 0 -i ${chunkListPath} -c copy ${mergedVideoPath}`, 
  //       (error, stdout, stderr) => {
  //         if (error) {
  //           console.error('Merge error:', error);
  //           reject(error);
  //         } else {
  //           console.log('Video merged successfully');
  //           resolve(mergedVideoPath);
  //         }
  //       }
  //     );
  //   });
  // }

  async mergeVideoChunks(callId: string): Promise<string> {
    const callRecordingDir = path.join(this.recordingFolderPath, callId);
    const outputFilePath = path.join(callRecordingDir, `${callId}_${Date.now()}_merged.webm`);
  
    // Check if directory exists
    if (!fs.existsSync(callRecordingDir)) {
      throw new Error(`Call recording directory does not exist: ${callRecordingDir}`);
    }
  
    // Get all chunk files sorted by timestamp
    const chunkFiles = fs.readdirSync(callRecordingDir)
      .filter((file) => file.startsWith('chunk_') && file.endsWith('.webm'))
      .sort((a, b) => {
        const timestampA = parseInt(a.split('_')[1].replace('.webm', ''), 10);
        const timestampB = parseInt(b.split('_')[1].replace('.webm', ''), 10);
        return timestampA - timestampB;
      });
  
    if (chunkFiles.length === 0) {
      throw new Error(`No video chunks found for callId: ${callId}`);
    }
  
    console.log(`Merging chunks for callId: ${callId}`);
    
    // Open a write stream for the final merged file
    const writeStream = fs.createWriteStream(outputFilePath);
  
    try {
      for (const chunkFile of chunkFiles) {
        const chunkFilePath = path.join(callRecordingDir, chunkFile);
        const chunkData = fs.readFileSync(chunkFilePath);
        writeStream.write(chunkData); // Append chunk data to the output file
      }
  
      // Finalize the write stream
      writeStream.end();
  
      // Wait for the stream to finish
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
  
    } catch (error) {
      console.error('Error during merging chunks:', error);
      throw error;
    }
  
    // Delete chunk files after successful merge
    for (const chunkFile of chunkFiles) {
      const chunkFilePath = path.join(callRecordingDir, chunkFile);
      fs.unlinkSync(chunkFilePath); // Delete the chunk file
    }
  
    console.log(`All chunks deleted for callId: ${callId}`);
    return outputFilePath;
  }
}
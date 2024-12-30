import { 
    WebSocketGateway, 
    WebSocketServer, 
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect 
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ScreenRecordingService } from './screen-recording.service';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })
  export class ScreenRecordingGateway 
    implements OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    server: Server;
  
    constructor(
      private screenRecordingService: ScreenRecordingService
    ) {}
  
    handleConnection(client: Socket) {
      console.log('Client connected:', client.id);
    }
  
    handleDisconnect(client: Socket) {
      console.log('Client disconnected:', client.id);
    }
  
    @SubscribeMessage('video-chunk')
    async handleVideoChunk(client: Socket, payload: any) {
      try {
        console.log("received event video-chunk")
        await this.screenRecordingService.saveVideoChunk(payload);
      } catch (error) {
        console.error('Error saving video chunk:', error);
      }
    }
  
    @SubscribeMessage('recording-complete')
    async handleRecordingComplete(client: Socket, payload: { callId: string }) {
      try {
        console.log("Received event recording-complete");
        const mergedVideoPath = await this.screenRecordingService.mergeVideoChunks(payload.callId);
        client.emit('recording-merged', { 
          path: mergedVideoPath 
        });
      } catch (error: any) {
        console.error('Error merging video:', error);
        client.emit('recording-error', { error: error.message });
      }
    }
  }
import { Module } from '@nestjs/common';
import { ScreenRecordingGateway } from './screen-recording.gateway';
import { ScreenRecordingService } from './screen-recording.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ScreenRecordingGateway, ScreenRecordingService]
})
export class AppModule {}
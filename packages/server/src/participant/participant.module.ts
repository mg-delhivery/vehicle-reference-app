import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ParticipantService } from './participant.service';

@Module({
  imports: [HttpModule],
  providers: [ParticipantService],
})
export class ParticipantModule {}

import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { HttpModule } from '@nestjs/axios';
import { ParticipantService } from '../participant/participant.service';
import { ParticipantModule } from '../participant/participant.module';

@Module({
  imports: [HttpModule, ParticipantModule],
  providers: [VehiclesService, ParticipantService],
  controllers: [VehiclesController],
})
export class VehiclesModule {}

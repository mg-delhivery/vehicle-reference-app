import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ParticipantService } from './participant/participant.service';
import { ParticipantModule } from './participant/participant.module';
import { VehiclesController } from './vehicles/vehicles.controller';
import { HttpModule } from '@nestjs/axios';
import { VehiclesService } from './vehicles/vehicles.service';

@Module({
  imports: [HttpModule, VehiclesModule, ParticipantModule],
  controllers: [AppController, VehiclesController],
  providers: [AppService, ParticipantService, VehiclesService],
})
export class AppModule {}

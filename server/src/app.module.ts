import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ParticipantService } from './participant/participant.service';
import { ParticipantModule } from './participant/participant.module';
import { VehiclesController } from './vehicles/vehicles.controller';
import { HttpModule } from '@nestjs/axios';
import { VehiclesService } from './vehicles/vehicles.service';
import { VehicleStateMachine } from './vehicles/vehicle.state-machine';

@Module({
  imports: [HttpModule, VehiclesModule, ParticipantModule],
  controllers: [AppController, VehiclesController],
  providers: [
    AppService,
    ParticipantService,
    VehiclesService,
    VehicleStateMachine,
  ],
})
export class AppModule {}

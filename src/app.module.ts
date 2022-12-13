import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehicleModule } from './vehicle/vehicle.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [VehicleModule, VehiclesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

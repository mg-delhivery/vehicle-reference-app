import {
  Controller,
  Get,
  Post,
  Put,
  Headers,
  Inject,
  Logger,
  Param,
  Body,
} from '@nestjs/common';
import { VehicleDTO } from '../common/dto/vehicle/vehicle.dto';
import { VehiclesService } from './vehicles.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AddVehicleRequestDTO } from '../common/dto/vehicle/vehicle.request.dto';

@ApiTags('Vehicle')
@Controller('vehicles')
export class VehiclesController {
  private logger = new Logger(this.constructor.name);

  @Inject(VehiclesService)
  private readonly vehicleService: VehiclesService;

  @Get('/')
  private async getAllVehicles(): Promise<VehicleDTO[]> {
    return await this.vehicleService.getAllVehicles();
  }

  @Get('/:vehicleId')
  private async getVehicle(
    @Param('vehicleId') vehicleId: string,
  ): Promise<VehicleDTO> {
    return await this.vehicleService.getVehicle(vehicleId);
  }

  @Post('/')
  private createVehicle(@Body() request: AddVehicleRequestDTO): Promise<void> {
    return this.vehicleService.addVehicle(request);
  }

  /*

  @Put('/:vehicleId/activate')
  private activateVehicle(@Headers() headers): Promise<void> {
    return;
  }

  @Put('/:vehicleId/deactivate')
  private deactivateVehicle(@Headers() headers): Promise<void> {
    return;
  }

  @Put('/:vehicleId/kill')
  private killVehicle(@Headers() headers): Promise<void> {
    return;
  }
*/
}

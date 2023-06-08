import {
  Controller,
  Get,
  Post,
  Inject,
  Logger,
  Param,
  Body,
  UsePipes,
  Put,
} from '@nestjs/common';
import { VehicleDTO } from '../common/dto/vehicle/vehicle.dto';
import { VehiclesService } from './vehicles.service';
import { ApiTags } from '@nestjs/swagger';
import {
  AddVehicleRequestDTO,
  TransitionVehicleStateRequestDTO,
  UpdateVehiclePropertiesRequestDTO,
} from '../common/dto/vehicle/vehicle.request.dto';
import { AddVehicleSchema } from './validation/add-vehicle.schema.validation';
import { SchemaValidationPipe } from '../common/validation/validation.pipe';
import { UpdateVehicleSchema } from './validation/update-vehicle.schema.validation';

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

  @Get('/token')
  private async getToken(): Promise<string> {
    return await this.vehicleService.getToken();
  }

  @Get('/:vehicleId')
  private async getVehicle(
    @Param('vehicleId') vehicleId: string,
  ): Promise<VehicleDTO> {
    return await this.vehicleService.getVehicle(vehicleId);
  }

  @Post('/')
  @UsePipes(new SchemaValidationPipe(AddVehicleSchema))
  private createVehicle(@Body() request: AddVehicleRequestDTO): Promise<void> {
    return this.vehicleService.addVehicle(request);
  }

  @Put('/:vehicleId')
  @UsePipes(new SchemaValidationPipe(UpdateVehicleSchema))
  private updateVehicle(
    @Param('vehicleId') vehicleId: string,
    @Body() request: UpdateVehiclePropertiesRequestDTO,
  ): Promise<void> {
    return this.vehicleService.updateVehicle(vehicleId, request);
  }

  @Put('/:vehicleId/transition')
  private async transitionVehicle(
    @Param('vehicleId') vehicleId: string,
    @Body() request: TransitionVehicleStateRequestDTO,
  ): Promise<void> {
    return this.vehicleService.transitionVehicle(vehicleId, request);
  }
}

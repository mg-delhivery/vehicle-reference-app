import {
  Controller,
  Get,
  Post,
  Inject,
  Logger,
  Param,
  Body,
  Headers,
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
import {
  ClientAuthHeaders,
  ClientHeaders,
} from 'src/common/models/client.auth.headers.model';

@ApiTags('Vehicle')
@Controller('vehicles')
export class VehiclesController {
  private logger = new Logger(this.constructor.name);

  @Inject(VehiclesService)
  private readonly vehicleService: VehiclesService;

  @Get('/')
  private async getAllVehicles(
    @Headers() clientHeaders: ClientHeaders,
  ): Promise<VehicleDTO[]> {
    return await this.vehicleService.getAllVehicles(
      this.extractAuth(clientHeaders),
    );
  }

  @Get('/:vehicleId')
  private async getVehicle(
    @Headers() clientHeaders: ClientHeaders,
    @Param('vehicleId') vehicleId: string,
  ): Promise<VehicleDTO> {
    return await this.vehicleService.getVehicle(
      this.extractAuth(clientHeaders),
      vehicleId,
    );
  }

  @Post('/')
  @UsePipes(new SchemaValidationPipe(AddVehicleSchema))
  private createVehicle(
    @Headers() clientHeaders: ClientHeaders,
    @Body() request: AddVehicleRequestDTO,
  ): Promise<void> {
    return this.vehicleService.addVehicle(
      this.extractAuth(clientHeaders),
      request,
    );
  }

  @Put('/:vehicleId')
  @UsePipes(new SchemaValidationPipe(UpdateVehicleSchema))
  private updateVehicle(
    @Headers() clientHeaders: ClientHeaders,
    @Param('vehicleId') vehicleId: string,
    @Body() request: UpdateVehiclePropertiesRequestDTO,
  ): Promise<void> {
    return this.vehicleService.updateVehicle(
      this.extractAuth(clientHeaders),
      vehicleId,
      request,
    );
  }

  @Put('/:vehicleId/transition')
  private async transitionVehicle(
    @Headers() clientHeaders: ClientHeaders,
    @Param('vehicleId') vehicleId: string,
    @Body() request: TransitionVehicleStateRequestDTO,
  ): Promise<void> {
    return this.vehicleService.transitionVehicle(
      this.extractAuth(clientHeaders),
      vehicleId,
      request,
    );
  }

  private extractAuth(headers: ClientHeaders): ClientAuthHeaders {
    return {
      x_coreos_access: headers['x-coreos-access'],
      x_coreos_request_id: headers['x-coreos-request-id'],
      x_coreos_tid: headers['x-coreos-tid'],
    };
  }
}

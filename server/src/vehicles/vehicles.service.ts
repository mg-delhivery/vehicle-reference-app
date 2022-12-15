import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { VehicleDTO } from '../common/dto/vehicle/vehicle.dto';
import { AddVehicleRequestDTO } from '../common/dto/vehicle/vehicle.request.dto';
import { handleErrorResponse } from '../common/error/axios.error';
import { ParticipantService } from '../participant/participant.service';

@Injectable()
export class VehiclesService {
  logger = new Logger(this.constructor.name);

  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ParticipantService)
  private readonly participantService: ParticipantService;

  private getVehiclesUrl(): string {
    return `https://${process.env.TENANT_DNS}/core/api/v2/participantservice/dgvehicles`;
  }

  async getAllVehicles(): Promise<VehicleDTO[]> {
    return await this.httpService.axiosRef
      .get(this.getVehiclesUrl(), {
        headers: await this.participantService.buildHeaders(),
      })
      .then((response) => {
        return response.data.data.participants;
      })
      .catch((error) => {
        const errorData = handleErrorResponse(error);
        this.logger.error(errorData);
        throw new HttpException(
          `Failed to get Vehicles: ${errorData.description}`,
          errorData.status,
        );
      });
  }

  async getVehicle(vehicleId: string): Promise<VehicleDTO> {
    return await this.httpService.axiosRef
      .get(this.getVehiclesUrl() + `/${vehicleId}`, {
        headers: await this.participantService.buildHeaders(),
      })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        this.logger.error(error);
        const errorData = handleErrorResponse(error);
        this.logger.error(errorData);
        throw new HttpException(
          `Failed to get Vehicle ${vehicleId}: ${errorData.description}`,
          errorData.status,
        );
      });
  }

  async addVehicle(vehicle: AddVehicleRequestDTO): Promise<void> {
    await this.httpService.axiosRef
      .post(this.getVehiclesUrl(), vehicle, {
        headers: await this.participantService.buildHeaders(),
      })
      .then(() => {
        this.logger.log(`Vehicle ${vehicle.name} successfully added`);
      })
      .catch((error) => {
        this.logger.error(error);
        const errorData = handleErrorResponse(error);
        this.logger.error(errorData);
        throw new HttpException(
          `Failed to create Vehicle ${vehicle.name}: ${errorData.description}`,
          errorData.status,
        );
      });
  }
}

import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { LifecycleConstants } from '../common/constants/lifecycle.constants';
import { ServiceConstants } from '../common/constants/service.constants';
import { VehicleDTO, VehicleStateDTO } from '../common/dto/vehicle/vehicle.dto';
import {
  AddVehicleRequestDTO,
  UpdateVehiclePropertiesRequestDTO,
} from '../common/dto/vehicle/vehicle.request.dto';
import { handleErrorResponse } from '../common/error/axios.error';
import { State } from '../common/models/state.model';
import { ParticipantService } from '../participant/participant.service';
import { VehicleStateMachine } from './vehicle.state-machine';

@Injectable()
export class VehiclesService {
  logger = new Logger(this.constructor.name);

  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ParticipantService)
  private readonly participantService: ParticipantService;

  @Inject(VehicleStateMachine)
  private readonly vehicleStateMachines: VehicleStateMachine;

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

  async getStateAndTransitions(vehicleId: string): Promise<State> {
    return await this.getVehicle(vehicleId)
      .then((response) => {
        return this.vehicleStateMachines.getState(response.state);
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

  async updateVehicle(
    vehicleId: string,
    vehicle: UpdateVehiclePropertiesRequestDTO,
  ): Promise<void> {
    await this.httpService.axiosRef
      .put(this.getVehiclesUrl() + `/${vehicleId}`, vehicle, {
        headers: await this.participantService.buildHeaders(),
      })
      .then(() => {
        this.logger.log(`Vehicle ${vehicleId} successfully updated`);
      })
      .catch((error) => {
        this.logger.error(error);
        const errorData = handleErrorResponse(error);
        this.logger.error(errorData);
        throw new HttpException(
          `Failed to update Vehicle ${vehicleId}: ${errorData.description}`,
          errorData.status,
        );
      });
  }

  async activateVehicle(vehicleId: string): Promise<void> {
    // verify vehicle exists and is in proper state
    await this.getVehicle(vehicleId)
      .then(async (vehicle) => {
        if (vehicle.state !== 'onboarding:onboarding') {
          throw new HttpException(
            `Error: Vehicle, ${vehicle.name}, not in proper state for transition`,
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.lifeCycleEvent(
          vehicleId,
          LifecycleConstants.onboarding_active.eventCode,
          LifecycleConstants.onboarding_active.reasonCode,
        )
          .then(() => {
            this.logger.log(`Vehicle ${vehicleId} successfully activated`);
          })
          .catch((error) => {
            this.logger.error(error);
            const errorData = handleErrorResponse(error);
            this.logger.error(errorData);
            throw new HttpException(
              `Failed to transition Vehicle ${vehicleId}: ${errorData.description}`,
              errorData.status,
            );
          });
      })
      .catch((error) => {
        this.logger.error(error);
        throw error;
      });
  }

  async deactivateVehicle(vehicleId: string): Promise<void> {
    // verify vehicle exists and is in proper state
    await this.getVehicle(vehicleId)
      .then(async (vehicle) => {
        if (vehicle.state !== 'active:active') {
          throw new HttpException(
            `Error: Vehicle, ${vehicle.name}, not in proper state for transition`,
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.lifeCycleEvent(
          vehicleId,
          LifecycleConstants.active_inactive.eventCode,
          LifecycleConstants.active_inactive.reasonCode,
        )
          .then(() => {
            this.logger.log(`Vehicle ${vehicleId} successfully deactivated`);
          })
          .catch((error) => {
            this.logger.error(error);
            const errorData = handleErrorResponse(error);
            this.logger.error(errorData);
            throw new HttpException(
              `Failed to transition Vehicle ${vehicleId}: ${errorData.description}`,
              errorData.status,
            );
          });
      })
      .catch((error) => {
        this.logger.error(error);
        throw error;
      });
  }

  async destroyVehicle(vehicleId: string): Promise<void> {
    // verify vehicle exists and is in proper state
    await this.getVehicle(vehicleId)
      .then(async (vehicle) => {
        if (vehicle.state !== 'inactive:inactive') {
          throw new HttpException(
            `Error: Vehicle, ${vehicle.name}, not in proper state for transition`,
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.lifeCycleEvent(
          vehicleId,
          LifecycleConstants.inactive_dead.eventCode,
          LifecycleConstants.inactive_dead.reasonCode,
        )
          .then(() => {
            this.logger.log(`Vehicle ${vehicleId} successfully destroyed`);
          })
          .catch((error) => {
            this.logger.error(error);
            const errorData = handleErrorResponse(error);
            this.logger.error(errorData);
            throw new HttpException(
              `Failed to transition Vehicle ${vehicleId}: ${errorData.description}`,
              errorData.status,
            );
          });
      })
      .catch((error) => {
        this.logger.error(error);
        throw error;
      });
  }

  private async lifeCycleEvent(
    vehicleId: string,
    eventCode: string,
    reasonCode: string,
  ) {
    await this.httpService.axiosRef.put(
      this.getVehiclesUrl() + `/${vehicleId}/state/event`,
      {
        eventCode: eventCode,
        reasonCode: reasonCode,
        timestamp: Date.now(),
        data: {},
        source: {
          appId: ServiceConstants.vehicle_app,
          userId: process.env.CLIENT_ID,
        },
      },
      {
        headers: await this.participantService.buildHeaders(),
      },
    );
  }
}

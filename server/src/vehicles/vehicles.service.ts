import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  ATTRIBUTES_CREATE_BODY,
  PARTICIPANT_CREATE_BODY,
  PARTICIPANT_EXISTS_ERROR_CODE,
  VEHICLE_NAME_PLURAL,
} from '../common/constants/vehicle.constants';
import { ServiceConstants } from '../common/constants/service.constants';
import { VehicleDTO } from '../common/dto/vehicle/vehicle.dto';
import {
  AddVehicleRequestDTO,
  TransitionVehicleStateRequestDTO,
  UpdateVehiclePropertiesRequestDTO,
} from '../common/dto/vehicle/vehicle.request.dto';
import { handleErrorResponse } from '../common/error/axios.error';
import { ParticipantService } from '../participant/participant.service';
import { VehicleStateMachine } from './vehicle.state-machine';
import { ClientAuthHeaders } from 'src/common/models/client.auth.headers.model';

@Injectable()
export class VehiclesService implements OnModuleInit {
  logger = new Logger(this.constructor.name);

  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ParticipantService)
  private readonly participantService: ParticipantService;

  @Inject(VehicleStateMachine)
  private readonly vehicleStateMachines: VehicleStateMachine;

  async onModuleInit() {
    try {
      const headers = await this.participantService.buildAdminHeaders();
      // create vehicle participant type
      await this.httpService.axiosRef
        .post(
          this.participantService.getParticipantServiceBaseUrl() +
            '/participant-types',
          PARTICIPANT_CREATE_BODY,
          {
            headers,
          },
        )
        .then(() => {
          this.logger.log(
            `Participant Type ${VEHICLE_NAME_PLURAL} Successfully Created`,
          );
        })
        .catch((error) => {
          const errorData = handleErrorResponse(error);
          if (errorData.code !== PARTICIPANT_EXISTS_ERROR_CODE) {
            throw new Error(
              `Error communicating with Participant Service: ${errorData.description}`,
            );
          } else {
            this.logger.log(
              `Participant Type ${VEHICLE_NAME_PLURAL} Already Exists`,
            );
          }
        });
      // create vehicle attributes
      await this.httpService.axiosRef
        .put(
          this.participantService.getParticipantServiceBaseUrl() +
            `/participant-types/${VEHICLE_NAME_PLURAL}/config/attributes`,
          ATTRIBUTES_CREATE_BODY,
          {
            headers,
          },
        )
        .then(() => {
          this.logger.log(
            `Participant Type ${VEHICLE_NAME_PLURAL} Attributes Added`,
          );
        })
        .catch((error) => {
          const errorData = handleErrorResponse(error);
          throw new Error(
            `Error communicating with Participant Service: ${errorData.description}`,
          );
        });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private getVehiclesUrl(): string {
    return `https://${process.env.TENANT_DNS}/core/api/v2/participants/${VEHICLE_NAME_PLURAL}`;
  }

  async getAllVehicles(
    clientAuthHeaders: ClientAuthHeaders,
  ): Promise<VehicleDTO[]> {
    return await this.httpService.axiosRef
      .get(this.getVehiclesUrl(), {
        headers: await this.participantService.buildUserHeaders(
          clientAuthHeaders,
        ),
      })
      .then((response) => {
        const vehicles: any[] = response.data.data.participants;
        vehicles.forEach((element) => {
          element.state = this.vehicleStateMachines.getState(element.state);
        });
        return vehicles;
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

  async getVehicle(
    clientAuthHeaders: ClientAuthHeaders,
    vehicleId: string,
  ): Promise<VehicleDTO> {
    return await this.httpService.axiosRef
      .get(this.getVehiclesUrl() + `/${vehicleId}`, {
        headers: await this.participantService.buildUserHeaders(
          clientAuthHeaders,
        ),
      })
      .then((response) => {
        const vehicle = response.data.data;
        vehicle.state = this.vehicleStateMachines.getState(vehicle.state);
        return vehicle;
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

  async addVehicle(
    clientAuthHeaders: ClientAuthHeaders,
    vehicle: AddVehicleRequestDTO,
  ): Promise<void> {
    await this.httpService.axiosRef
      .post(this.getVehiclesUrl(), vehicle, {
        headers: await this.participantService.buildUserHeaders(
          clientAuthHeaders,
        ),
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
    clientAuthHeaders: ClientAuthHeaders,
    vehicleId: string,
    vehicle: UpdateVehiclePropertiesRequestDTO,
  ): Promise<void> {
    await this.httpService.axiosRef
      .put(this.getVehiclesUrl() + `/${vehicleId}`, vehicle, {
        headers: await this.participantService.buildUserHeaders(
          clientAuthHeaders,
        ),
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

  async transitionVehicle(
    clientAuthHeaders: ClientAuthHeaders,
    vehicleId: string,
    request: TransitionVehicleStateRequestDTO,
  ): Promise<void> {
    await this.getVehicle(clientAuthHeaders, vehicleId).then(
      async (vehicle) => {
        //get possible transitions for current state
        if (vehicle.state.transitions.includes(request.state)) {
          const transitionCodes = this.vehicleStateMachines.getTransitionCodes(
            vehicle.state.current,
          );
          await this.lifeCycleEvent(
            clientAuthHeaders,
            vehicleId,
            transitionCodes.eventCode,
            transitionCodes.reasonCode,
          )
            .then(() => {
              this.logger.log(
                `Vehicle ${vehicleId} transitioned from ${vehicle.state.current} to ${request.state}`,
              );
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
        } else {
          throw new HttpException(
            `Error: Invalid State Transition ${vehicle.state.current} to ${request.state}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );
  }

  private async lifeCycleEvent(
    clientAuthHeaders: ClientAuthHeaders,
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
        headers: await this.participantService.buildUserHeaders(
          clientAuthHeaders,
        ),
      },
    );
  }
}

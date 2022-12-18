import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ServiceConstants } from '../common/constants/service.constants';
import { v4 as uuidv4 } from 'uuid';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';

@Injectable()
export class ParticipantService {
  logger = new Logger(this.constructor.name);

  @Inject(HttpService)
  private readonly httpService: HttpService;

  getParticipantServiceBaseUrl(): string {
    return `https://${process.env.TENANT_DNS}/core/api/v2/participantservice`;
  }

  private getClientCredentialsBaseUrl(tenantDns: string): string {
    return `https://${process.env.TENANT_DNS}/core/api/v1/aaa`;
  }

  async buildHeaders(): Promise<AxiosRequestHeaders> {
    const axiosResponse = await this.generateClientCredentials();
    return {
      [ServiceConstants.http_headers.x_coreos_request_id]: uuidv4(),
      [ServiceConstants.http_headers.x_coreos_tid]: process.env.TENANT_ID,
      [ServiceConstants.http_headers.x_coreos_userinfo]:
        '{ "id": "1", "name": "vehicle-reference-app"}',
      [ServiceConstants.http_headers.x_coreos_access]:
        axiosResponse.data.data.accessToken,
      [ServiceConstants.http_headers.x_coreos_origin_token]:
        axiosResponse.data.data.accessToken,
    };
  }

  async generateClientCredentials(): Promise<AxiosResponse<any>> {
    const url = `${this.getClientCredentialsBaseUrl(
      process.env.TENANT_DNS,
    )}/auth/client-credentials`;

    const headers = {
      [ServiceConstants.http_headers.x_coreos_request_id]: uuidv4(),
    };
    const clientCredentialsPayload = {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    };
    return this.httpService.axiosRef
      .post(url, clientCredentialsPayload, {
        headers,
      })
      .catch((error) => {
        this.logger.error(error);
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
}

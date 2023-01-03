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
import { ClientAuthHeaders } from 'src/common/models/client.auth.headers.model';

@Injectable()
export class ParticipantService {
  logger = new Logger(this.constructor.name);

  @Inject(HttpService)
  private readonly httpService: HttpService;

  getParticipantServiceBaseUrl(): string {
    return `https://${process.env.TENANT_DNS}/core/api/v2/participants`;
  }

  private getClientCredentialsBaseUrl(tenantDns: string): string {
    return `https://${process.env.TENANT_DNS}/core/api/v1/aaa`;
  }

  async buildUserHeaders(
    clientAuth: ClientAuthHeaders,
  ): Promise<AxiosRequestHeaders> {
    return {
      [ServiceConstants.http_headers.x_coreos_request_id]:
        clientAuth.x_coreos_request_id,
      [ServiceConstants.http_headers.x_coreos_tid]: clientAuth.x_coreos_tid,
      [ServiceConstants.http_headers.x_coreos_userinfo]:
        '{ "id": "1", "name": "vehicle-reference-app"}',
      [ServiceConstants.http_headers.x_coreos_access]:
        clientAuth.x_coreos_access,
      [ServiceConstants.http_headers.x_coreos_origin_token]:
        clientAuth.x_coreos_access,
    };
  }

  async buildAdminHeaders(): Promise<AxiosRequestHeaders> {
    const adminCreds = await this.generateAppAdminCredentials();
    return {
      [ServiceConstants.http_headers.x_coreos_request_id]: uuidv4(),
      [ServiceConstants.http_headers.x_coreos_tid]: process.env.TENANT_ID,
      [ServiceConstants.http_headers.x_coreos_userinfo]:
        '{ "id": "1", "name": "vehicle-reference-app"}',
      [ServiceConstants.http_headers.x_coreos_access]:
        adminCreds.data.data.accessToken,
      [ServiceConstants.http_headers.x_coreos_origin_token]:
        adminCreds.data.data.accessToken,
    };
  }

  async generateAppAdminCredentials(): Promise<AxiosResponse<any>> {
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

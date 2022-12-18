import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

export class SchemaValidationPipe implements PipeTransform {
  logger = new Logger(this.constructor.name);
  constructor(private schema: ObjectSchema) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      const { error } = this.schema.validate(value, { abortEarly: false });
      if (error) {
        this.logger.error(error);
        throw new HttpException(
          `Bad Request arguments: ${error}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return value;
  }
}

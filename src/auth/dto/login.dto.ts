import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ required: true }) // Para documentación en Swagger
  email: string;

  @ApiProperty({ required: true }) // Para documentación en Swagger
  password: string;
}

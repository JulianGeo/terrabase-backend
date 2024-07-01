import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Match } from '../../../../common/decorators/match.decorator';
import { CreateUserDto } from './create-user.dto';
import { Roles } from '../../../../common/enum/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Match('password', {
        message: 'Las contraseñas no coninciden',
        isOptional: true,
    })
    passwordConfirmation: string;

    @ApiProperty()
    @IsBoolean()
    enabled: boolean;

    @ApiProperty({ enum: Roles })
    @IsEnum(Roles)
    role: string;
}


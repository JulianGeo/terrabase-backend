import { IsBoolean, IsDefined, IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Match } from "../../../../common/decorators/match.decorator";
import { CreateUserI } from "../interface/user.interface";
import { ApiProperty } from "@nestjs/swagger";
import { Roles } from "../../../../common/enum/role.enum";


export class CreateUserDto implements CreateUserI {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @Match('password', {
        message: 'Las contraseñas no coninciden',
    })
    passwordConfirmation: string;

    @IsDefined()
    @IsBoolean()
    enabled: boolean;

    @ApiProperty({ enum: Roles })
    @IsEnum(Roles)
    role: string;
}

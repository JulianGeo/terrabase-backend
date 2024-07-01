import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { Login } from "../interface/Login.interface";


export class LoginDto implements Login {
    @ApiProperty()
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    password: string;
}
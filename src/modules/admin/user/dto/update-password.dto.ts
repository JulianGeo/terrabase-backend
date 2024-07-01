import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { Match } from '../../../../common/decorators/match.decorator';


export class ChangePasswordDto implements ChangePasswordDto {
    @ApiProperty()
    @IsDefined()
    @IsString()
    currentPassword: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    newPassword: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    @Match('newPassword', { message: 'Las contraseñas no coninciden' })
    passwordConfirmation: string;
}

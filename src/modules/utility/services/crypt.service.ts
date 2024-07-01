import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptService {

    constructor() { }

    async encryptString(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    validateString(password: string, encryptedPassword: string): boolean {
        const isValid = bcrypt.compareSync(password, encryptedPassword);
        return isValid;
    }


}

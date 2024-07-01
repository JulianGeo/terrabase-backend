import { AuthModule, PrismaModule, UserModule } from "./admin";
import { UtilityModule } from "./utility/utility.module";

export default [
    AuthModule,
    UserModule,
    PrismaModule,
    UtilityModule
]
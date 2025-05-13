import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      "your_mongoDB_uri"
    ),
    UserModule,
    AuthModule
  ],
})
export class AppModule {}

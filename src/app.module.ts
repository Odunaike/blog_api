import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { S3Module } from './s3/s3.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      "**********************"//your mongo uri
    ),
    UserModule,
    AuthModule,
    BlogModule,
    S3Module
  ],
})
export class AppModule {}

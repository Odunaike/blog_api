import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blog.schema';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {name: Blog.name, schema: BlogSchema}
      ]
    ),
    S3Module
  ],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schema/blog.schema';
import { Model } from 'mongoose'
import { CreateBlogDto } from './dto/create_blog_dto';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
    ){}

    createBlogPost(authorId: string, blogPost: CreateBlogDto){
        try {
            const blog = new this.blogModel(
                {
                    authorId: authorId,
                    ...blogPost
                }
            ).save()
            return blog
        } catch (error) {
            throw new HttpException("error saving to database", HttpStatus.CONFLICT)
        }
    }

    async getAllApprovedBlogPost(){
        try {
           return await this.blogModel.find({
                status : true
           })
        } catch (error) {
            throw new HttpException("Error getting posts from databse", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllUnapprovedBlogPost(){
        try{
            return await this.blogModel.find(
                {
                    status: false
                }
            )
        }catch (error){
            throw new HttpException("Error getting posts from databse", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    adminApprovePost(postId: string){
        try {
            const updatedPost = this.blogModel.findByIdAndUpdate(
                postId, {status: true}, {new : true}
            )
            return updatedPost
        } catch (error) {
            throw new HttpException("unable to approve post", HttpStatus.CONFLICT)
        }
    }

}

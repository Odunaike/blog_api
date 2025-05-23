import { Controller,Get, Post, UploadedFile, UseInterceptors, Body, HttpException, HttpStatus, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { BlogService } from './blog.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBlogDto } from './dto/create_blog_dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/enum/roles';
import { Roles } from 'src/decorator/role.decorator';

@Controller('blog')
export class BlogController {
    constructor(
        private s3Service: S3Service,
        private blogService: BlogService
    ){}

    @Post('create')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async createBlogPost(
        @UploadedFile() file: Express.Multer.File,
        @Body() blogPost: CreateBlogDto,
        @Request() req
    ){
        if(!file){
            throw new HttpException("Image file required", HttpStatus.BAD_REQUEST)
        }else if(
            !['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)
        ){
            throw new HttpException("Only png, jpg, and jpeg formats are permissible", HttpStatus.BAD_REQUEST)
        }
        console.log(file.mimetype)
        console.log(file)

        try {
            const imageUrl = await this.s3Service.uploadImageFile(
                file.buffer,
                file.originalname,
                file.mimetype
            )
            //add the image url and authorId (i.e user._id) to the blog Dto
            blogPost.image = imageUrl
            const authorId = req.user.id //todo change to author name

            const createdBlog = await this.blogService.createBlogPost(authorId, blogPost)
            return createdBlog.toObject()
        } catch (error) {
            if(error instanceof HttpException){throw new HttpException(error.message, error.getStatus())}
            console.log(error)
        }
    }

    @Get('posts')
    getAllApprovedPost(){
        return this.blogService.getAllApprovedBlogPost()
    }

    @Get('pendingposts')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    getAllUnapprovedPost(){
        return this.blogService.getAllUnapprovedBlogPost()
    }

    @Patch('approve/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    adminApprovePost(@Param('id') id: string){
        return this.blogService.adminApprovePost(id)
    }
}

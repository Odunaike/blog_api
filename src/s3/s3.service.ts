import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
    private readonly s3: S3
    private readonly AWS_BUCKET_NAME = "naike.dev-bucket"

    constructor(){
        this.s3 = new S3(
            {
                accessKeyId: "*********", //keep hidden
                secretAccessKey: "*****************************", //keep hidden
                region: "*****" //keep hidden
            }
        )
    }
    
    async uploadImageFile(imageBuffer: Buffer, name: string, mimeType: string){
        const storedLocation = 'blog-api-images/' + name   //location in your bucket
        const params: S3.Types.PutObjectRequest = {
            Bucket: this.AWS_BUCKET_NAME,
            Key: storedLocation,
            Body: imageBuffer,
            ContentType: mimeType,
            ContentDisposition: 'inline',
        }

        try {
            const result = await this.s3.upload(params).promise()
            console.log(result.Location)
            return result.Location
        } catch (error) {
            console.log(error)
        }

    }
}

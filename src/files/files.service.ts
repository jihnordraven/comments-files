import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'
import { UploadFile } from './core/types/upload-file.type'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FilesService {
	constructor(private readonly config: ConfigService) {}

	private readonly S3 = new S3Client({
		region: this.config.getOrThrow('AWS_S3_REGION')
	})

	private readonly bucket: string = this.config.getOrThrow<string>('S3_BUCKET')

	public async uploadFile(payload: UploadFile): Promise<any> {
		const filename: string = `${v4()}-${new Date()}.${payload.extname}`

		await this.S3.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: filename,
				Body: payload.buffer
			})
		)
	}

	public async deleteFile(fileUrl: string): Promise<void> {
		await this.S3.send(
			new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: fileUrl
			})
		)
	}
}

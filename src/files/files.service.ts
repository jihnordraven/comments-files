import { Injectable, Logger } from '@nestjs/common'
import { v4 } from 'uuid'
import { UploadFile } from './core/types/upload-file.type'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { ConfigService } from '@nestjs/config'
import { red } from 'colorette'
import { extname } from 'path'

@Injectable()
export class FilesService {
	private logger: Logger = new Logger(FilesService.name)

	constructor(private readonly config: ConfigService) {}

	private readonly s3 = new S3Client({
		region: 'eu-central-1'
	})

	private readonly bucket: string = this.config.getOrThrow<string>('S3_BUCKET')

	public async uploadFile(payload: UploadFile): Promise<any> {
		const filename: string = `${v4()}-${new Date()}.${extname(payload.originalname)}`

		const buffer: Buffer = Buffer.from(payload.buffer.data)
		const upload = new Upload({
			client: this.s3,
			params: {
				Bucket: this.bucket,
				Key: filename,
				Body: buffer
			}
		})

		try {
			const s3ObjectUrl: string = this.config.getOrThrow('S3_OBJECT_URL')
			const fileUrl: string = `${s3ObjectUrl}/${filename}`

			await upload.done()

			return { ok: true, fileUrl }
		} catch (err: unknown) {
			this.logger.error(red(`${err}`))
			return { ok: false, err: 'Unable to upload a file' }
		}
	}

	public async deleteFile(fileUrl: string): Promise<void> {
		await this.s3.send(
			new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: fileUrl
			})
		)
	}
}

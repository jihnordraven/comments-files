import { Injectable, Logger } from '@nestjs/common'
import { v4 } from 'uuid'
import { UploadFile } from '../core/types/upload-file.type'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { ConfigService } from '@nestjs/config'
import { red } from 'colorette'
import { extname } from 'path'
import { DeleteFileRes, UploadFileRes } from '../core/types'

@Injectable()
export class FilesService {
	private logger: Logger = new Logger(FilesService.name)

	constructor(private readonly config: ConfigService) {}

	private readonly s3 = new S3Client({
		region: this.config.getOrThrow<string>('AWS_S3_REGION')
	})

	private readonly bucket: string = this.config.getOrThrow<string>('AWS_S3_BUCKET')

	public async uploadFile(payload: UploadFile): Promise<UploadFileRes> {
		// const filename: string = `${v4()}${extname(payload.originalname)}`
		const filename: string = v4() + '-' + payload.originalname

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
			const s3ObjectUrl: string = this.config.getOrThrow('AWS_S3_OBJECT_URL')
			const fileUrl: string = `${s3ObjectUrl}/${filename}`

			await upload.done()

			return { ok: true, fileUrl }
		} catch (err: unknown) {
			this.logger.error(red(`${err}`))
			return { ok: false, err: 'Unable to upload a file' }
		}
	}

	public async deleteFile(fileUrl: string): Promise<DeleteFileRes> {
		try {
			await this.s3.send(
				new DeleteObjectCommand({
					Bucket: this.bucket,
					Key: fileUrl
				})
			)

			return { ok: true }
		} catch (err: unknown) {
			return { ok: false, err: err as string }
		}
	}
}

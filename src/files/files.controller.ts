import { Controller, Logger } from '@nestjs/common'
import { FilesService } from './files.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UploadFile } from './core/types/upload-file.type'
import { black } from 'colorette'

@Controller()
export class FilesController {
	private readonly logger: Logger = new Logger(FilesController.name)

	constructor(private readonly filesService: FilesService) {}

	@MessagePattern('uploadFile')
	public async uploadFile(@Payload() payload: UploadFile): Promise<any> {
		this.logger.log(black(`uploadFile. Payload: ${payload}`))

		return await this.filesService.uploadFile(payload)
	}

	@MessagePattern('deleteFile')
	public async deleteFile(@Payload() fileUrl: string): Promise<any> {
		this.logger.log(black(`deleteFile. fileUrl: ${fileUrl}`))

		return await this.filesService.deleteFile(fileUrl)
	}
}

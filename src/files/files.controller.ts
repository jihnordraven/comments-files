import { Controller, Logger } from '@nestjs/common'
import { FilesService } from './files.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UploadFile } from './core/types/upload-file.type'
import { bgCyan } from 'colorette'

@Controller()
export class FilesController {
	private readonly logger: Logger = new Logger(FilesController.name)

	constructor(private readonly filesService: FilesService) {}

	@MessagePattern('uploadFile')
	public async uploadFile(@Payload() payload: UploadFile): Promise<boolean> {
		this.logger.log(bgCyan(`uploadFile. Payload: ${payload}`))

		return Boolean(await this.filesService.uploadFile(payload))
	}

	@MessagePattern('deleteFile')
	public async deleteFile(@Payload() fileUrl: string): Promise<boolean> {
		this.logger.log(bgCyan(`deleteFile. fileUrl: ${fileUrl}`))

		return Boolean(await this.filesService.deleteFile(fileUrl))
	}
}

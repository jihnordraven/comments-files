import { Controller } from '@nestjs/common'
import { FilesService } from './files.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UploadFile } from './core/types/upload-file.type'

@Controller()
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@MessagePattern('uploadFile')
	public async uploadFile(@Payload() payload: UploadFile): Promise<boolean> {
		return Boolean(await this.filesService.uploadFile(payload))
	}

	@MessagePattern('deleteFile')
	public async deleteFile(@Payload() fileUrl: string): Promise<boolean> {
		return Boolean(await this.filesService.deleteFile(fileUrl))
	}
}

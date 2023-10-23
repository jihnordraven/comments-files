import { Test, TestingModule } from '@nestjs/testing'
import { FilesController } from './files.controller'
import { FilesService } from '../services/files.service'

describe('FilesController', (): void => {
	let filesController: FilesController

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FilesController],
			providers: [
				{
					provide: FilesService,
					useValue: {}
				}
			]
		}).compile()

		filesController = module.get<FilesController>(FilesController)
	})

	it('should be defined', (): void => {
		expect(filesController).toBeDefined()
	})
})

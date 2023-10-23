import { Test, TestingModule } from '@nestjs/testing'
import { FilesService } from '../services/files.service'
import { ConfigService } from '@nestjs/config'

describe('FilesService', (): void => {
	let filesService: FilesService

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FilesService,
				{
					provide: ConfigService,
					useValue: {
						getOrThrow: jest.fn()
					}
				}
			]
		}).compile()

		filesService = module.get<FilesService>(FilesService)
	})

	it('should be defined', (): void => {
		expect(filesService).toBeDefined()
	})
})

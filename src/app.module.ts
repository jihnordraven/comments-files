import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { FilesModule } from './files/files.module'

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), FilesModule]
})
export class AppModule {}

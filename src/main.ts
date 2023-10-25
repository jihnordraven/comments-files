import { INestMicroservice, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'
import { blue, red } from 'colorette'
import * as dotenv from 'dotenv'

dotenv.config()

const logger: Logger = new Logger('bootstrap')

const RMQ_HOST: string = String(process.env.RMQ_HOST)
const RMQ_QUEUE: string = String(process.env.RMQ_QUEUE)

let app: INestMicroservice

const bootstrap = async (): Promise<void> => {
	app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.RMQ,
		options: {
			urls: [RMQ_HOST],
			queue: RMQ_QUEUE
		}
	})

	await app
		.listen()
		.then(() => logger.log(blue('Files microservice is listening')))
		.catch((err: string) =>
			logger.error(red(`Something went wrong... Learn more at: ${err}`))
		)
}

export default app

bootstrap()

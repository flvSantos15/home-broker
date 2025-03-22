import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ConfluentKafkaServer } from '../kafka/confluent-kafka-server';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new ConfluentKafkaServer({
      server: {
        'bootstrap.servers': 'localhost:9092', // Pode ficar em uma variavel de ambiente
      },
      consumer: {
        allowAutoTopicCreation: true,
        sessionTimeout: 10000, // 10 seconds
        rebalanceTimeout: 10000, // 10 seconds
      },
    }),
  });
  console.log('Starting Kafka microservice');
  await app.listen();
}
bootstrap();

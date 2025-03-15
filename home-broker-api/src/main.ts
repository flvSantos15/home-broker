import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const assetsService = app.get(AssetsService);
  // assetsService
  //   .subscribeNewPriceChangeEvents()
  //   .subscribe((event) => console.log(event));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import 'reflect-metadata';
import { createServer } from './app/app';

async function bootstrap() {
  const app = await createServer();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`WeMall API listening on port ${port}`);
  });
}

void bootstrap();

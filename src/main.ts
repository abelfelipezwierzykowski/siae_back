import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',      // Vite dev server
      'http://localhost:3000',      // Local development
      'http://localhost:5174',      // Alternative port
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL,      // From env variable
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT ?? 3000}`);
    console.log(`📝 CORS habilitado para: ${process.env.FRONTEND_URL || 'localhost:5173'}`);
  });
}
bootstrap();

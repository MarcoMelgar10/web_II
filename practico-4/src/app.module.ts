import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonaController } from './persona/persona.controller';
import { PersonasController } from './personas/personas.controller';
import { PersonasService } from './personas/personas.service';

@Module({
  imports: [],
  controllers: [AppController, PersonaController, PersonasController],
  providers: [AppService, PersonasService],
})
export class AppModule {}

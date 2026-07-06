import { Controller } from '@nestjs/common';
import { PersonasService } from './personas.service';
@Controller('personas')
export class PersonasController {
  public constructor(private readonly sevice: PersonaSevice) {  }
  @Get()
  public getPersonas(): string {
    return 'This action returns all personas';
  }
  @Post()
  public createPersona(): string {
    return this.service.createPersona(@Req() req);
  }
}

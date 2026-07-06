import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonasService {
  public getPersonas(): string {
    return 'This action returns all personas';
  }
}

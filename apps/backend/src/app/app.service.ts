import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData() {
    return {
      message: 'hello',
      items: [1, 2, 3],
    };
  }
}

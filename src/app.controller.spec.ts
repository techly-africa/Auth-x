import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

class ConfigServiceMock {
  get(key: string, defaultValue: any) {
    if (key === 'APP_NAME') {
      return 'YourAppName';
    }
    return defaultValue;
  }
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useClass: ConfigServiceMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return a welcome message with the app name', () => {
      const expectedMessage = 'Welcome to YourAppName APIs!';

      expect(appController.getHello()).toBe(expectedMessage);
    });
  });
});
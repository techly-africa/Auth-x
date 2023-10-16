import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

jest.mock('@nestjs-modules/mailer');

describe('MailService', () => {
    let mailService: MailService;
    let mailerService: MailerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MailService, MailerService],
        }).compile();

        mailService = module.get<MailService>(MailService);
        mailerService = module.get<MailerService>(MailerService);
    });

    describe('sendUserEmail', () => {
        it('should send an email', async () => {
            const user = 'nambaje edwin';
            const verificationToken = 'token123';
            const email = 'nambajeeedwin@gmail.com';

            await mailService.sendUserEmail(user, verificationToken, email);

            expect(mailerService.sendMail).toHaveBeenCalledWith({
                to: email,
                from: expect.any(String),
                subject: expect.any(String),
                text: expect.any(String),
                html: expect.any(String),
            });
        });
    });
});

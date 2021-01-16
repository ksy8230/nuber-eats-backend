import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/jwt/jwt.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    console.log('a', options);
    // this.sendEmail('testing', 'test');
  }
  async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ): Promise<boolean> {
    // console.log(got);
    // console.log(FormData);
    const form = new FormData();
    form.append('from', `mailgun@${this.options.domain}`);
    form.append('to', `${this.options.fromEmail}`);
    form.append('subject', subject);
    // form.append('content', content);
    // form.append('html', `<h1>Test body</h2>`);
    form.append('template', template);
    // form.append('v:code', `asaswddf`);
    // form.append('v:username', `ksy`);

    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));
    console.log('this.options=', this.options);
    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('verify email', 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}

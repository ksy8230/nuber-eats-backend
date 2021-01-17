import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

// 실제로 유저 생성을 (post)호출하면 이메일 인증 코드가 테스트 할 때마다 날아오기 때문에 post 를 모킹한다
jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql';

describe('UsersModule (e2e)', () => {
  let app;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('createAccount', () => {
    const EMAIL = 'mollog@gmail.com';
    it('should create user account', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
            mutation {
              createAccount(input: {
                email: "${EMAIL}",
                password: "1234",
                role:Owner
              }) {
                ok
                error
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should fail if account is existed', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
            mutation {
              createAccount(input: {
                email: "${EMAIL}",
                password: "1234",
                role:Owner
              }) {
                ok
                error
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });
  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyemail');
  it.todo('editProfile');

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });
});

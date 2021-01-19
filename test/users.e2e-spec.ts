import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from 'src/users/entities/verification.entity';

// 실제로 유저 생성을 (post)호출하면 이메일 인증 코드가 테스트 할 때마다 날아오기 때문에 post 를 모킹한다
jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
  email: 'mollog@gmail.com',
  password: '1234',
};

describe('UsersModule (e2e)', () => {
  let app;
  let jwtToken: string;
  let usersRepository: Repository<User>;
  let verificationsRepository: Repository<Verification>;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string) =>
    baseTest().set('X-JWT', jwtToken).send({ query });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    verificationsRepository = module.get<Repository<Verification>>(
      getRepositoryToken(Verification),
    );
    await app.init();
  });

  describe('createAccount', () => {
    const EMAIL = 'mollog@gmail.com';
    it('should create user account', () => {
      return publicTest(
        `
            mutation {
              createAccount(input: {
                email: "${testUser.email}",
                password: "${testUser.password}",
                role:Owner
              }) {
                ok
                error
              }
            }
          `,
      )
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should fail if account is existed', () => {
      return publicTest(`
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
          `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });

  describe('login', () => {
    it('should login with correct credential', () => {
      return publicTest(`
          mutation {
            login(input : {
              email: "${testUser.email}",
              password: "${testUser.password}",
            }) {
              ok
              error
              token
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          jwtToken = login.token;
        });
    });
    it('should not be able to login with wrond credential', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            login(input : {
              email: "${testUser.email}",
              password: "xxx",
            }) {
              ok
              error
              token
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toBe('비밀번호가 틀렸습니다.');
          expect(login.token).toBe(null);
        });
    });
  });

  describe('profile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await usersRepository.find();
      userId = user.id;
    });
    it('should see a user profile', () => {
      return privateTest(`
        {
          userProfile(userId:${userId}) {
            ok
            error
            user {
              id
            }
          }
        }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: {
                  ok,
                  error,
                  user: { id },
                },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        });
    });
    it('should not find a user profile', () => {
      return privateTest(`
        {
          userProfile(userId:404) {
            ok
            error
            user {
              id
            }
          }
        }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { ok, error, user },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('유저를 찾을 수 없습니다.');
          expect(user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should find my profile', () => {
      return privateTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(testUser.email);
        });
    });
    it('should not find my profile', () => {
      return publicTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          console.log('aaa =', res.body);
          const {
            body: { errors },
          } = res;
          expect(errors[0].message).toBe('Forbidden resource');
        });
    });
  });

  describe('editProfile', () => {
    const NEW_EMAIL = 'ksy@new.com';
    it('should change email', () => {
      return privateTest(`
            mutation {
              editProfile(input: {
                email: "${NEW_EMAIL}"
              }) {
                ok
                error
              }
            }
          `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should have new email', () => {
      return privateTest(`
          {
            me {
              email
            }
          }`)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(NEW_EMAIL);
        });
    });
  });

  describe('verifyemail', () => {
    let verificationCode: string;
    beforeAll(async () => {
      const [verification] = await verificationsRepository.find();
      verificationCode = verification.code;
    });
    it('should verify email', () => {
      return publicTest(`
              mutation {
                verifyEmail(input:{
                  code:"${verificationCode}"
                }){
                  ok
                  error
                }
              }
            `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail on verification code not found', () => {
      return publicTest(`
              mutation {
                verifyEmail(input:{
                  code:"xxx"
                }){
                  ok
                  error
                }
              }
            `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('인증을 찾을 수 없습니다.');
        });
    });
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });
});

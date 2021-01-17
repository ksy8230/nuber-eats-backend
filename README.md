<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description
- About The Backend of Nuber-eats Clone 학습용
- framework : Nestjs, Typescript, graphql 
- orm : typeorm
- database : postgresql

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## 토막 기록

- nest로 application 만들기
```
nest g application
```

### nestjs & graphql
- graphql 파일을 따로 작성할 필요없이 @nestjs/graphql에서 제공하는 `Query를 이용하면 자동으로 해당 파일이 메모리에 생성된다
- `@ObjectType` 는 자동으로 스키마를 빌드하기 위해 사용하는 graphql 데코레이터이다
- argument
- `@InputType` 은 하나의 object, `@ArgsType` 은 분리된 값들을 그래프큐엘 args로 전달 가능하게 만듦
- dto 유효성 검사하기 
```
npm i class-validator
npm install class-transformer
```
### database
#### TYPE ORM
- 직접 sql문을 작성해서 데이터베이스로 보내는 것도 가능하지만 `TYPE ORM`(객체 관계 매핑)을 쓰면 타입스크립트의 좋은 점을 이용할 수 있다. 타입을 쓸 수 있고 nestjs와 연계할 수 있고 데이터베이스 상호작용을 테스트할 수 있다.
- orm을 쓰면 어려운 sql문을 쓰는 대신 코드를 써서 상호작용할 수 있다.
- `TYPE ORM`은 nodejs에 많은 데이터베이스를 지원한다 (mysql, postgres, cockroachDB, MariaDB)
- `Postql`, `pgAdmin` 프로그램 설치
- `TYPE ORM`과 동일한 기능을 제공하는 시퀄라이즈가 있지만 이건 js로 대부분 개발되어있고 nodejs에서만 동작하는 반면 `TYPE ORM`은 nodejs 뿐만 아니라 리액트네이티브 등 다양한 플랫폼을 지원한다.
#### TYPE ORM for PostgreSQL 설치
```
npm install --save @nestjs/typeorm typeorm pg
```
- nestjs에서 환경설정하기
- 아래 모듈은 dotenv 최상위에서 실행되기 때문에 dotenv 내부에서 사용 가능하다
```
npm i --save @nestjs/config
```
- 플랫폼 환경에 구애 받지 않고 환경 변수를 사용할 수 있게 해준다
```
npm i cross-env
```
- 환경변수 유효성 검사를 해준다
```
npm i joi
```
- ts 파일에서 js 파일 모듈을 가져올 때 -> ex. import * as Joi from 'joi';


#### TYPE ORM and NESTJS
- entity는 데이터베이스에 저장되는 데이터의 형태를 보여주는 모델
- `@Entity` 는 TYPEORM이 DB에 스키마를 저장하게 해 준다
- `@ObjectType()`, `@Entity()` 이용하면 클래스 하나로 그래프큐엘 스키마와 디비에 저장되는 저장 형식을 한번에 생성 가능하다
##### NESTJS에 TYPE ORM을 이용해 DB 연결하는 법
- repository를 import하면 데이터베이스와 상호작용이 가능하다
- 0. app 모듈에 TypeOrmModule에 `"entities": [Restaurant]` 연결되어 있다. (DB)
- 1. 해당 모듈 파일에서 Typeorm을 이용해서 해당 entity를 import함으로서 repository를 추가
- 2. 해당 service 파일에서 repository를 사용하기 위한 작업
- - 해당 모듈 파일에서 providers에 해당 service가 추가되어야 함
- - 해당 모듈 resolver에서 해당 모듈 service를 constructor에 추가
- 3. 해당 resolver는 this.해당service.getAll() 식으로 서비스 파일 함수 작성 가능
- - 해당 서비스 파일에서 @InjectRepository(해당 entity)를 추가하여 db 접근

- @InputType(), @ArgsType()의 차이
- argument가 많은 resolver 함수 줄여서 사용하는 법 (dto 사용하기)

#### User 모듈
1. User Entity
- id
- createAt
- updatedAt
- email
- password
- role (client|owner|delivery)
2. 비밀번호 bcrypt
```
npm i bcrypt
```
- User Entity에서 `@BeforeInsert()`를 사용해 DB에 password를 넣기 전에 
- 비밀번호를 백엔드에서 해싱은 가능하나 해싱된 비밀번호를 다시 원복할 수 없다 (해싱은 단방향만)
- 해싱은 고유하다 (ex. 1234 -> #$FE@SEWE 값은 달라지지 않는다) 따라서 1234를 받아와서 해싱을 하고 그 해싱된 값이 db와 일치하는지 체크한다
3. jwt token 구현하기
```
npm i jsonwebtoken @types/jsonwebtoken
```
- token에 담긴 정보를 알아내는 것이 어렵지 않기 때문에 민감한 정보보다는 아이디 식별 정도에 사용하는 것이 좋다
- user 모듈에 `ConfigService`를 import해서 ConfigService를 user.service에서 사용 가능하게 하면 nestjs 방식으로 환경변수를 사용할 수 있다

- - jwt module 직접 구현해서 ConfigService처럼 사용하기
- JwtModule 에서 forRoot 함수 구현 (설정이 가능한 동적 모듈을 리턴, JwtService를 export해서 user 모듈에서 사용 가능)
- 모듈의 proviers를 상세코드로 바꿔보면 아래와 같다
```
  providers: [
    {
      provide: CONFIG_OPTIONS, // 커스텀 이름
      useValue: options, 
    },
    JwtService,
  ],
```
4. middleware
- token을 받아서 나인지 확인하는 중간 미들웨어 구현
5. graphql context
> 아폴로 서버, 그래프 큐엘은 context를 가지고 있고 context에 어떤 것들을 지정하더라도 resolver에서 확인 가능하다
- 나인지 확인하는 로직
- - 토큰을 http headers에 넣어 보내면 이 `토큰`은 `request`로 보내진다
- - 이 request가 `jwtMiddleware`에서 멈춘다
- - `jwtMiddleware`가 토큰을 찾고(decode) 이것을 `request user`에 넣어준다
- - request가 `graphql 모듈`로 와서 `context`안에 들어온다 (! context는 매요청마다 호출된다)
- - `authorization guard`를 거쳐서 `resolver`에 도착하면
- - 직접 만든 `@UseGuards(AuthGuard)`로 context를 가져다가 graphql context를 가져온다
- - `graphql context`에서 `user를 리턴`한다

6. AuthGuard
```
nest g mo auth
```
- nextjs에서 제공하는 guard를 사용해서 auth 기능 사용하기

7. verify email
- service 파일에서 db 테이블간의 관계가 있을 때 관련된 다른 테이블 정보를 가져오고 싶으면 아래와 같이 기재. 
```
const verification = await this.verifications.findOne(
    { code },
    { relations: ['user'] }, // 관련된 user 전체 정보를 가져옴
    // {loadRelationIds: true} // 관련된 user id만 가져옴
  );
```

8. jest (test - unit 테스트 설정)
- package.json 에서 루트 경로 설정해서 절대경로로 파일을 import 한다
```
  "jest": {
    "moduleNameMapper":{
      "^src/(.*)":"<rootDir>/$1"
    },
    ...
```
- unit test : 코드 각 줄이 의도한 대로 실행하는지 (결과가 아닌 동작을 테스트)
- 외부 모듈 `mock`하는 법
- 실제 기능 함수를 사용하면서 테스트하고 싶을 때 `spyOn`

9. jest (test - e2e 테스트 설정)
- /test/jest-e2e.json 파일에 경로 수정
```
  "moduleNameMapper":{
    "^src/(.*)":"<rootDir>/../src/$1"
  }
```
- test용 database를 생성하여 실제 typeorm, 실제 db를 사용
#### 이슈 리스트
1. 이슈 : "id" 칼럼의 null 값이 not null 제약조건입니다
- 원인 : 상속 받는 create-entity에게 id 값이 할당되지 않는 이슈
- 해결 : 부모 entity  `@PrimaryColumn()` -> `@PrimaryGeneratedColumn()`으로 변경

2. 이슈 : 비밀번호 수정 시 해싱되지 않고 디비에 저장된다
- 원인 : this.users.update(....); <- update 메서드가 엔티티를 업데이트하지 않음
- 해결 : this.users.save(...) 로 수정

3. 이슈: 유저 정보를 업데이트하거나 email 인증을 하면 비밀번호가 갱신된다
- 원인 : 유저 정보를 업데이트하거나 email 인증을 하면 `this.users.save` 함수가 실행되면서 `@BeforeInsert(), @BeforeUpdate() ` hook이 실행되어 해싱이 두번 된다.
- 해결 : password 컬럼을 `{ select: false }`로 설정하여 비밀번호가 선택된 경우에만(비밀번호가 있는 경우에만) `@BeforeInsert(), @BeforeUpdate() ` hook에서 해싱되도록 수정
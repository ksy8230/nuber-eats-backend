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


#### 이슈 리스트
- 이슈 : "id" 칼럼의 null 값이 not null 제약조건입니다
- 원인 : 상속 받는 create-entity에게 id 값이 할당되지 않는 이슈
- 해결 : 부모 entity  `@PrimaryColumn()` -> `@PrimaryGeneratedColumn()`으로 변경
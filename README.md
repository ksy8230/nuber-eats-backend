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
1. User 모델 (Entity)
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
- (refactor) app 모듈에 AuthModule을 연결해서 모든 서비스 함수에 `APP_GUARD` 추가하기
- (refactor) role을 데코레이터 함수로 만들어서 모든 서비스 함수에 아래와 같은 식으로 사용자 권한(가드) 사용하기
```
@Role(['Owner'])
async createRestaurant() {
  ...
}
```
- (refactor) AuthGuard 클래스에서 constructor에 reflector 변수를 활용하여 "Client" | "Owner" | "Delivery" | "Any" 들을 가져오고 케이스에 맞게 if문을 사용하여 true, false 반환
- 6-1. rule
- - role이 없으면 metadata가 없다는 의미이다 (user가 없다는 의미로 public 함수에서 사용) = return true
- - graphqlContext에 user가 없으면 토큰이 없거나 토큰을 아예 보내지 않았다는 의미이다 = return false
- - user이 있고 role이 any면 내 정보 조회와 같이 권한에 상관없이 모두가 사용 가능한 함수 사용 = return true
- - user이 있고 role이 any가 아닌 다른 것들이면 레스토랑 생성과 같이 권한에 관련된 함수 사용 = return true


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
- beforeAll에서 테스트 시작 전에 유저 레파지토리 가져오는 법


#### Restaurant 모듈
1. Restaurant 모델 (Entity)
- name
- category
- address
- coverImage
- owner
- ownerId (@RelationId 사용하여 owner의 id만 지정)

2. 레스토랑 기능
- See Categories
- See Restaurants by Category (pagination)
- See Restaurants (pagination)
- See Restaurant

- Edit Restaurant
- Delete Restaurant

- Create Dish
- Edit Dish
- Delete Dish

3. 레파지토리에서 확장시키기 (커스텀 레파지토리 만들기)
- `CategoryRepository` 파트 부분
- db 관련 함수를 추가로 확장시키고 싶을 때 사용하는 방법
- ex. this.xxx.save, this.xxx.create, `this.xxx.getOrCreate (custom)`

### 모델 간의 관계
- 하나의 레스토랑은 여러개의 메뉴를 갖는다 (oneToMany)
- 하나 메뉴는 하나의 레스토랑을 갖는다 (ManyToOne)
- 하나의 레스토랑은 하나의 카테고리를 갖는다 (oneToMany)
- 하나의 카테고리는 여러개의 레스토랑을 갖는다 (ManyToOne)

#### eager relation
- 엔티티에서 `{ eager: true }` 옵션을 사용하면 디비에서 해당 엔티티를 로드할 때마다 자동으로 로드되는 relationship 효과를 얻을 수 있다.

[예시 코드](https://github.com/ksy8230/nuber-eats-backend/commit/020842b8448be93729b505b264ed1994aae58740#diff-9231deae4e9daf94bbbd4adece01f22d5e7344da5c45955035d5ef6c2dcc1408)

## Subscription
graphql에는 query / mutation / subscription 이렇게 총 3가지 오퍼레이션 타입이 존재한다.   
query: 데이터 조회를 위해서 사용   
mutation: 데이터 변경을 위해서 사용   
`subscription`: 실시간 어플리케이션 구현을 위해 사용   
- query와 muation이 sever/client 모델을 따르는 반면, subscription은 pub/sub (발행/구독) 모델을 따른다.
- query와 muation이 HTTP 프로토콜을 사용하는 반면, subscription은 Web Socket 프로토콜을 사용한다.
- Web Socket을 사용하면 클라이언트는 서버와 연결 채널을 유지한 채로, 서버에서 발생하는 이벤트를 실시간으로 수신받을 수 있다.

[설치 및 연결 예시 코드](https://github.com/ksy8230/nuber-eats-backend/commit/af4a3b5f178764c487d927a4498ee7c4c31e2eaa)


## 이슈 리스트
1. 이슈 : "id" 칼럼의 null 값이 not null 제약조건입니다
- 원인 : 상속 받는 create-entity에게 id 값이 할당되지 않는 이슈
- 해결 : 부모 entity  `@PrimaryColumn()` -> `@PrimaryGeneratedColumn()`으로 변경

2. 이슈 : 비밀번호 수정 시 해싱되지 않고 디비에 저장된다
- 원인 : this.users.update(....); <- update 메서드가 엔티티를 업데이트하지 않음
- 해결 : this.users.save(...) 로 수정

3. 이슈: 유저 정보를 업데이트하거나 email 인증을 하면 비밀번호가 갱신된다
- 원인 : 유저 정보를 업데이트하거나 email 인증을 하면 `this.users.save` 함수가 실행되면서 `@BeforeInsert(), @BeforeUpdate() ` hook이 실행되어 해싱이 두번 된다.
- 해결 : password 컬럼을 `{ select: false }`로 설정하여 비밀번호가 선택된 경우에만(비밀번호가 있는 경우에만) `@BeforeInsert(), @BeforeUpdate() ` hook에서 해싱되도록 수정

4. 이슈 : 스키마는 유니크한 타입의 이름을 가져야 한다
- 원인 : input 타입에 이름이 지정되지 않으면 같은 이름을 같는 input 타입의 스키마가 생성된다
- 해결 : input 타입에 이름을 지정 (ex 아래 코드)
```
@InputType('UserInputType', { isAbstract: true })
```

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- 누어 이츠 백엔드 

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
- objectType
- argument
- `InputType` 은 하나의 object, `ArgsType` 은 분리된 값들을 그래프큐엘 args로 전달 가능하게 만듦
- dto 유효성 검사하기 
```
npm i class-validator
npm install class-transformer
```
### database
- `TYPE ORM`
- - 직접 sql문을 작성해서 데이터베이스로 보내는 것도 가능하지만 `TYPE ORM`(객체 관계 매핑)을 쓰면 타입스크립트의 좋은 점을 이용할 수 있다. 타입을 쓸 수 있고 nestjs와 연계할 수 있고 데이터베이스 상호작용을 테스트할 수 있다.
- - orm을 쓰면 어려운 sql문을 쓰는 대신 코드를 써서 상호작용할 수 있다.
- - `TYPE ORM`은 nodejs에 많은 데이터베이스를 지원한다 (mysql, postgres, cockroachDB, MariaDB)
- `Postql`, `pgAdmin` 프로그램 설치
- `TYPE ORM` 과 동일한 기능을 제공하는 시퀄라이즈가 있지만 이건 js로 대부분 개발되어있고 nodejs에서만 동작하는 반면 `TYPE ORM`은 nodejs 뿐만 아니라 리액트네이티브 등 다양한 플랫폼을 지원한다.
- #### install TYPE ORM for PostgreSQL
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
- 환경변수 유효성 검사
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

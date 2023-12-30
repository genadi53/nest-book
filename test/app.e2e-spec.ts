import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { EditUserDto } from './../src/user/dto/edit-user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const test_port = 3333;
  const test_url = `http://localhost:${test_port}`;

  const authData: AuthDto = {
    email: 'test@email.com',
    name: 'test',
    password: 'test',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(test_url);
  });

  afterAll(() => {
    app.close();
  });

  it.todo('should pass');

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Auth', () => {
    describe('SignUp', () => {
      it('should throw if no body', () => {
        return pactum.spec().post(`/auth/sign-up`).expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post(`/auth/sign-up`)
          .withBody(authData)
          .expectStatus(201);
        // .inspect();
      });
    });

    describe('Login', () => {
      it('should login', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody(authData)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get current User', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/profile')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200);
        // .inspect();
      });
    });

    describe('update User', () => {
      it('should update user', () => {
        const editDto: EditUserDto = {
          name: 'name-updated',
        };

        return pactum
          .spec()
          .patch('/users/edit')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .withBody(editDto)
          .expectStatus(200)
          .expectBodyContains(editDto.name);
      });
    });
  });

  describe('Book', () => {
    describe('Add book', () => {});
    describe('Get book by id', () => {});
    describe('Edit book', () => {});
    describe('Delete book', () => {});
  });
});

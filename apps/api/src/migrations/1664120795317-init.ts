import { MigrationInterface, QueryRunner } from "typeorm";

export class init1664120795317 implements MigrationInterface {
    name = 'init1664120795317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."rooms_moods_enum" AS ENUM('Bình thường', 'Cô đơn', 'Buồn', 'Phẫn nộ', 'Vui vẻ', 'Lo lắng', 'Bối rối', 'Căng thẳng', 'Nhẹ nhàng', 'Đau khổ', 'Sợ hãi', 'Đang yêu')`);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "topic" text NOT NULL, "capacity" integer NOT NULL, "description" character varying, "language" character varying NOT NULL, "moods" "public"."rooms_moods_enum" array NOT NULL DEFAULT '{Bình thường}', "creator_id" uuid, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "scp" text NOT NULL, "is_default" boolean DEFAULT false, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "image" character varying, "full_name" character varying, "email_verified" boolean, "phone" character varying, "privilege" integer array DEFAULT '{}', "address" character varying, "city" character varying, "state" character varying, "state_iso_code" character varying, "zip" character varying, "country" character varying, "country_iso_code" character varying, "isComplete" boolean, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "message" text NOT NULL, "userId" uuid, CONSTRAINT "REL_4838cd4fc48a6ff2d4aa01aa64" UNIQUE ("userId"), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rooms_users" ("room_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_c84bfaa983e801678b81dc074fd" PRIMARY KEY ("room_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6c27556dfb176800f672e561f1" ON "rooms_users" ("room_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_45df56ba03303a41324dfd3f40" ON "rooms_users" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "users_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_bd1f2365f91582fcdaadc7abdbe" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_bd1f2365f91582fcdaadc7abdbe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1cf664021f00b9cc1ff95e17de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4435209df12bc1f001e536017"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_45df56ba03303a41324dfd3f40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6c27556dfb176800f672e561f1"`);
        await queryRunner.query(`DROP TABLE "rooms_users"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TYPE "public"."rooms_moods_enum"`);
    }

}

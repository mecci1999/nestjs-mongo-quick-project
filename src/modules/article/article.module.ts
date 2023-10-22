import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Article } from "./article.model";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { ConfigModule } from "modules/config/config.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Article", schema: Article }]),
    ConfigModule,
  ],
  providers: [ArticleService],
  exports: [ArticleService],
  controllers: [ArticleController],
})
export class SituationModule {}

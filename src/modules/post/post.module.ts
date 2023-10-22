import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Post } from "./post.model";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { ConfigModule } from "modules/config/config.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Post", schema: Post }]),
    ConfigModule,
  ],
  providers: [PostService],
  exports: [PostService],
  controllers: [PostController],
})
export class PostModule {}

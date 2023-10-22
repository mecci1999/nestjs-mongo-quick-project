import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment } from "./comment.model";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Comment", schema: Comment }])],
  providers: [CommentService],
  exports: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}

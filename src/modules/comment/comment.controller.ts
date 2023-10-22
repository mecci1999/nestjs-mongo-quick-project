import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  HttpStatus,
  Req,
  HttpException,
  Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  CommentService,
  IGenericMessageBody,
  PaginationResult,
} from "./comment.service";
import { IComment } from "./comment.model";
import { PatchCommentPayload } from "./payload/patch.comment.payload";
import _ from "lodash";

@ApiBearerAuth()
@ApiTags("comment")
@Controller("api/comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 获取评论列表
   */
  @Post("list")
  @ApiResponse({ status: 200, description: "Fetch Post Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Post Request Failed" })
  async getPostList(
    @Body() payload: PatchCommentPayload,
  ): Promise<PaginationResult<IComment[]>> {
    const list = await this.commentService.getAll(
      payload?.pageIndex || 1,
      payload?.pageSize || 10,
    );
    if (!list) {
      throw new BadRequestException("The Comment list is empty.");
    }

    return list;
  }

  /**
   * 新增评论
   */
  @Post("create")
  //   @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: "新增作品成功" })
  @ApiResponse({ status: 400, description: "新增作品失败" })
  async createPost(@Body() payload: PatchCommentPayload) {
    // 判断是否为空
    if (!payload) {
      throw new HttpException("参数错误", HttpStatus.BAD_REQUEST);
    }

    // // 获取跳转地址
    const accid = payload.accid;
    const content = payload.content;

    return this.commentService.create({
      accid,
      content,
    });
  }

  /**
   * 删除评论
   */
  @Post("delete")
  @ApiResponse({ status: 200, description: "Post Post Request Received" })
  @ApiResponse({ status: 400, description: "Post Post Request Failed" })
  async deletePost(@Body("ids") ids: string[]) {
    // 判断是否为空
    if (!ids || ids.length === 0) {
      throw new HttpException("错误的参数", HttpStatus.BAD_REQUEST);
    }

    // 修改Post内容
    return this.commentService.delete(ids);
  }
}

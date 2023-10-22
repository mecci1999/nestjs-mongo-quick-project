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
  ArticleService,
  IGenericMessageBody,
  PaginationResult,
} from "./article.service";
import { IArticle } from "./article.model";
import { PatchArticlePayload } from "./payload/patch.article.payload";
import _ from "lodash";

@ApiBearerAuth()
@ApiTags("article")
@Controller("api/article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * 获取首页列表
   */
  @Post("list/front")
  @ApiResponse({ status: 200, description: "Fetch Post Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Post Request Failed" })
  async getFrontPostList(
    @Body() payload: PatchArticlePayload,
  ): Promise<PaginationResult<IArticle[]>> {
    const list = await this.articleService.getAll(
      "",
      payload?.pageIndex || 1,
      payload?.pageSize || 10,
      true,
    );
    if (!list) {
      throw new BadRequestException("The Post list is empty.");
    }

    return list;
  }

  /**
   * 后台获取动态列表
   */
  @Post("list/end")
  @ApiResponse({ status: 200, description: "Fetch Post Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Post Request Failed" })
  async getEndPostListEnd(
    @Body() payload: PatchArticlePayload,
  ): Promise<PaginationResult<IArticle[]>> {
    const list = await this.articleService.getAll(
      payload?.keyword || "",
      payload?.pageIndex || 1,
      payload?.pageSize || 10,
      false,
    );
    if (!list) {
      throw new BadRequestException("The Post list is empty.");
    }

    return list;
  }

  /**
   * 新增Situation
   */
  @Post("create")
  //   @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: "新增动态成功" })
  @ApiResponse({ status: 400, description: "新增动态失败" })
  async createPost(@Body() payload: PatchArticlePayload) {
    // 判断是否为空
    if (!payload) {
      throw new HttpException("参数错误", HttpStatus.BAD_REQUEST);
    }

    return this.articleService.create({
      ...payload,
      time: Date.now(),
      status: 0,
    });
  }

  /**
   * 更新Post
   */
  @Post("update")
  @ApiResponse({ status: 200, description: "Post Post Request Received" })
  @ApiResponse({ status: 400, description: "Post Post Request Failed" })
  async updatePost(@Body() payload: PatchArticlePayload) {
    // 判断是否为空
    if (!payload._id) {
      throw new HttpException("错误的PostId", HttpStatus.BAD_REQUEST);
    }

    // 通过PostId获取到对应的filename
    const post = await this.articleService.get(payload._id);

    if (!post) {
      throw new HttpException("不存在对应的Post", HttpStatus.BAD_REQUEST);
    }

    // 修改Post内容
    return this.articleService.edit(payload);
  }

  /**
   * 删除post
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
    return this.articleService.delete(ids);
  }
}

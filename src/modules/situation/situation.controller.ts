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
  SituationService,
  IGenericMessageBody,
  PaginationResult,
} from "./situation.service";
import { ISituation } from "./situation.model";
import { PatchSituationPayload } from "./payload/patch.situation.payload";
import _ from "lodash";
import { join } from "path";
import formidable from "formidable";
import * as fs from "fs";
import { saveFile } from "utils/file-upload";
import { ConfigService } from "modules/config/config.service";

@ApiBearerAuth()
@ApiTags("situation")
@Controller("api/situation")
export class SituationController {
  constructor(
    private readonly postService: SituationService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 获取首页列表
   */
  @Post("list/front")
  @ApiResponse({ status: 200, description: "Fetch Post Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Post Request Failed" })
  async getFrontPostList(
    @Body() payload: PatchSituationPayload,
  ): Promise<PaginationResult<ISituation[]>> {
    const list = await this.postService.getAll(
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
    @Body() payload: PatchSituationPayload,
  ): Promise<PaginationResult<ISituation[]>> {
    const list = await this.postService.getAll(
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
  async createPost(@Body() payload: PatchSituationPayload) {
    // 判断是否为空
    if (!payload) {
      throw new HttpException("参数错误", HttpStatus.BAD_REQUEST);
    }

    return this.postService.create({
      ...payload,
      time: Date.now(),
      status: 0,
      isTop: false,
    });
  }

  /**
   * 上传Post图片
   */
  @Post("upload")
  //   @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: "Post Post Request Received" })
  @ApiResponse({ status: 400, description: "Post Post Request Failed" })
  async uploadPostImage(@Req() request: any) {
    const form = formidable({});

    const formData: any = {};

    return new Promise((resolve, reject) => {
      form.onPart = (part: any) => {
        if (!part.filename) {
          form._handlePart(part);
          return;
        }
      };

      form.parse(request.raw, (err, fields, files) => {
        if (err) {
          reject(
            new HttpException(
              "Error parsing form data",
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        }

        const uploadedFile = files.file;

        if (!uploadedFile || uploadedFile.length === 0) {
          reject(new HttpException("No file uploaded", HttpStatus.BAD_REQUEST));
        }

        const fileExtension = uploadedFile
          .map((item) => item.mimetype)
          .join(",");

        const allowedExtensions = ["image/jpg", "image/jpeg", "image/png"];

        if (!allowedExtensions.find((item) => fileExtension.includes(item))) {
          reject(
            new HttpException("Invalid file type", HttpStatus.BAD_REQUEST),
          );
        }

        const file = uploadedFile[0];
        const filePath = file.filepath;

        // 获取文件大小
        const maxSize = parseInt(this.configService.get("POST_FILE_SIZE"), 10);

        if (file.size > maxSize) {
          // 超出限制大小
          reject(new HttpException("文件大小超出限制", HttpStatus.BAD_REQUEST));
        }

        // 将文件存储到指定目录下
        const targetDirectory = join(process.cwd(), "uploads", "situation");
        // // 生成随机的文件名
        const randomFileName =
          Math.random().toString(36).substring(7) + uploadedFile[0].newFilename;
        // // 最终的保存路径
        const targetFilePath = join(targetDirectory, randomFileName);

        fs.readFile(filePath, (err, data) => {
          if (err) {
            reject(
              new HttpException("Upload file failed", HttpStatus.BAD_REQUEST),
            );
          }

          // 获取到上传文件的buffer
          formData["file"] = data;
          resolve({
            data,
            path: targetFilePath,
            filename: randomFileName,
            size: file.size,
            mimetype: file.mimetype,
          });
        });
      });
    }).then(
      async (file: {
        data: Buffer;
        path: string;
        filename: string;
        size: number;
        mimetype: string;
      }) => {
        const targetDirectory = join(process.cwd(), "uploads", "situation");
        // 检查该目录是否存在
        if (!fs.existsSync(targetDirectory)) {
          // 不存在，创建该目录
          fs.mkdirSync(targetDirectory, { recursive: true });
        }

        // 存储文件的buffer到特定目录下或者oss中
        const result = await saveFile(file.path, file.data);

        if (!result) {
          // 上传失败
          return Promise.reject(
            new HttpException("文件上传失败", HttpStatus.BAD_REQUEST),
          );
        }

        // 上传成功
        return Promise.resolve({
          fileName: file.filename,
          size: file.size,
          mimetype: file.mimetype,
        });
      },
    );
  }

  /**
   * 获取Post图片服务
   */
  @Get(":situationId")
  @ApiResponse({ status: 200, description: "Post Post Request Received" })
  @ApiResponse({ status: 400, description: "Post Post Request Failed" })
  async getPostImage(@Res() res, @Param("situationId") situationId: string) {
    // 判断是否为空
    if (!situationId) {
      throw new HttpException("situationId", HttpStatus.BAD_REQUEST);
    }

    // 通过postId获取到对应的filename
    const situation = await this.postService.get(situationId);
    // 文件名
    const filename = situation.fileName;

    // Post图存在的目录路径
    const path = join(process.cwd(), "uploads", "situation", filename);
    // 检查文件是否存在
    const fileExist = fs.existsSync(path);
    if (!fileExist) {
      throw new HttpException("不存在对应的Post图", HttpStatus.BAD_REQUEST);
    }

    // 获取文件
    const file = fs.readFileSync(path);
    res.type(situation.mimetype).send(file);
  }

  /**
   * 更新Post
   */
  @Post("update")
  @ApiResponse({ status: 200, description: "Post Post Request Received" })
  @ApiResponse({ status: 400, description: "Post Post Request Failed" })
  async updatePost(@Body() payload: PatchSituationPayload) {
    // 判断是否为空
    if (!payload._id) {
      throw new HttpException("错误的PostId", HttpStatus.BAD_REQUEST);
    }

    // 通过PostId获取到对应的filename
    const post = await this.postService.get(payload._id);

    if (!post) {
      throw new HttpException("不存在对应的Post", HttpStatus.BAD_REQUEST);
    }

    // 修改Post内容
    return this.postService.edit(payload);
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
    return this.postService.delete(ids);
  }
}

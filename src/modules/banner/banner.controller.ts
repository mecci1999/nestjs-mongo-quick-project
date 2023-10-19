import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BannerService, IGenericMessageBody } from "./banner.service";
import { IBanner } from "./banner.model";
import { PatchBannerPayload } from "./payload/patch.banner.payload";
import { FileInterceptor } from "@nestjs/platform-express";
import _ from "lodash";

@ApiBearerAuth()
@ApiTags("banner")
@Controller("api/banner")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  /**
   * 获取banner列表
   */
  @Get("list")
  //   @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: "Fetch Banner Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Banner Request Failed" })
  async getBannerList(): Promise<IBanner[]> {
    const list = await this.bannerService.getAll();
    if (!list) {
      throw new BadRequestException("The banner list is empty.");
    }

    return list;
  }

  /**
   * 新增banner
   */
  @Post("upload")
  //   @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor("file"))
  @ApiResponse({ status: 200, description: "Post Banner Request Received" })
  @ApiResponse({ status: 400, description: "Post Banner Request Failed" })
  async createBanner(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    // 判断是否为空
    // if (!payload) {
    //   throw new BadRequestException("The request params is error!");
    // }

    // // 获取跳转地址
    // const jumpUrl = payload.jumpUrl;
    // // 获取排序
    // const order = payload.order;
    // 获取上传的图片文件
    const fileInfo = _.pick(file, ["mimetype", "filename", "size"]);
    // 获取文件名
    const fileName = fileInfo.filename;
    const size = fileInfo.size;
    const mimetype = fileInfo.mimetype;

    return {
      fileName,
      size,
      mimetype,
    };
    // return this.bannerService.create({
    //   jumpUrl,
    //   order,
    //   fileName,
    //   size,
    //   mimetype,
    // });
  }
}

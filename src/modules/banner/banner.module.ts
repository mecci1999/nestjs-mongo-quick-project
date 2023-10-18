import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { MongooseModule } from "@nestjs/mongoose";
import { Banner } from "./banner.model";
import { fileUploadFilter } from "../../utils/file-upload-filter";
import { ConfigService } from "../config/config.service";
import { ConfigModule } from "modules/config/config.module";

// 图片拦截器

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Banner", schema: Banner }]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dest: "uploads/banner",
        fileFilter: fileUploadFilter,
        limits: {
          fileSize: parseInt(configService.get("BANNER_FILE_SIZE"), 10),
          files: 1,
        },
      }),
    }),
  ],
  providers: [],
  exports: [],
  controllers: [],
})
export class BannerModule {}

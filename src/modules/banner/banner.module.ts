import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Banner } from "./banner.model";
import { BannerService } from "./banner.service";
import { BannerController } from "./banner.controller";
import { ConfigModule } from "modules/config/config.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Banner", schema: Banner }]),
    ConfigModule,
  ],
  providers: [BannerService],
  exports: [BannerService],
  controllers: [BannerController],
})
export class BannerModule {}

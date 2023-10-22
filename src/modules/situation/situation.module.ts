import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Situation } from "./situation.model";
import { SituationService } from "./situation.service";
import { SituationController } from "./situation.controller";
import { ConfigModule } from "modules/config/config.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Situation", schema: Situation }]),
    ConfigModule,
  ],
  providers: [SituationService],
  exports: [SituationService],
  controllers: [SituationController],
})
export class SituationModule {}

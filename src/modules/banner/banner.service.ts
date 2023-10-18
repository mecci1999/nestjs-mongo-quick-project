import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { AppRoles } from "../app/app.roles";
import { PatchBannerPayload } from "./payload/patch.banner.payload";
import { IBanner } from "./banner.model";

/**
 * Models a typical response for a crud operation
 */
export interface IGenericMessageBody {
  /**
   * Status message to return
   */
  message: string;
}

/**
 * Banner Service
 */
@Injectable()
export class BannerService {
  /**
   * Constructor
   * @param {Model<IBanner>} bannerModel
   */
  constructor(
    @InjectModel("Banner") private readonly bannerModel: Model<IBanner>,
  ) {}

  /**
   * 获取所有的banner
   */
  private getAll(): Promise<IBanner[]> {
    return this.bannerModel
      .find({})
      .select("_id fileName jumpUrl order")
      .exec();
  }

  /**
   * 获取单条banner
   */
  private get(id: string): Promise<IBanner> {
    return this.bannerModel.findById(id).exec();
  }

  /**
   * 新增一个banner
   */
  private async create(payload: PatchBannerPayload): Promise<IBanner> {
    const createBanner = new this.bannerModel({ ...payload });

    return createBanner.save();
  }
}

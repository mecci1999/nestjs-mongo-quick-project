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
  public getAll(): Promise<IBanner[]> {
    return this.bannerModel
      .find({})
      .select("_id fileName jumpUrl order")
      .exec();
  }

  /**
   * 获取单条banner
   */
  public get(id: string): Promise<IBanner> {
    return this.bannerModel.findById(id).exec();
  }

  /**
   * 新增一个banner
   */
  public async create(payload: PatchBannerPayload): Promise<IBanner> {
    const createBanner = new this.bannerModel({ ...payload });

    return createBanner.save();
  }

  /**
   * 编辑banner根据id
   */
  public async edit(payload: PatchBannerPayload): Promise<IBanner> {
    const { _id } = payload;
    const updatedProfile = await this.bannerModel.updateOne({ _id }, payload);

    if ((updatedProfile as any)?.nModified !== 1) {
      throw new BadRequestException(
        "The banner with that id does not exist in the system. Please try another id.",
      );
    }

    return this.get(_id);
  }

  /**
   * 删除一个banner根据id
   */
  public async delete(_id: string): Promise<IGenericMessageBody> {
    return this.bannerModel.deleteOne({ _id }).then((banner) => {
      if (banner.deletedCount === 1) {
        return { message: `Deleted ${_id} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a banner by the name of ${_id}.`,
        );
      }
    });
  }
}

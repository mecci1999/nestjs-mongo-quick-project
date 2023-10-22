import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { AppRoles } from "../app/app.roles";
import { PatchSituationPayload } from "./payload/patch.situation.payload";
import { ISituation } from "./situation.model";

/**
 * Models a typical response for a crud operation
 */
export interface IGenericMessageBody {
  /**
   * Status message to return
   */
  message: string;
}

export interface PaginationResult<T> {
  data: T;
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Situation Service
 */
@Injectable()
export class SituationService {
  /**
   * Constructor
   * @param {Model<ISituation>} situationModel
   */
  constructor(
    @InjectModel("Situation")
    private readonly situationModel: Model<ISituation>,
  ) {}

  /**
   * 获取所有的动态
   */
  public async getAll(
    keyword: string,
    pageIndex: number,
    pageSize: number,
    isIndex: boolean,
  ): Promise<PaginationResult<ISituation[]>> {
    const totalRecords = await this.situationModel.countDocuments();
    const totalPages = Math.ceil(totalRecords / pageSize);
    const actualPage = Math.min(Math.max(pageIndex, 1), totalPages);
    const skip = (actualPage - 1) * pageSize;
    const cache: { data?: ISituation; index?: number }[] = []; // 缓存

    const query = this.situationModel
      .find({ $or: [{ title: { $regex: keyword, $options: "i" } }] })
      .select("_id title content author fileName time status isTop")
      .skip(skip)
      .limit(pageSize);

    let data = await query.exec();

    if (isIndex) {
      // 首页
      data = data
        .filter((situation) => situation.status === 1)
        .map((item, index) => {
          if (item.isTop) {
            cache.push({ data: item, index });
          }
          return item;
        });

      if (cache.length > 0) {
        cache.map((item) => {
          // 删除对应的元素
          data.splice(item.index, 1);
          data.unshift(item.data);
        });
      }
    }

    return {
      data,
      totalRecords,
      totalPages,
      currentPage: actualPage,
      pageSize,
    };
  }

  /**
   * 获取单条situation
   */
  public get(id: string): Promise<ISituation> {
    return this.situationModel.findById(id).exec();
  }

  /**
   * 新增一个situation
   */
  public async create(payload: PatchSituationPayload): Promise<ISituation> {
    const createPost = new this.situationModel({ ...payload });

    return createPost.save();
  }

  /**
   * 编辑situation根据id
   */
  public async edit(payload: PatchSituationPayload): Promise<ISituation> {
    const { _id } = payload;
    const updatedProfile = await this.situationModel.updateOne(
      { _id },
      payload,
    );

    if ((updatedProfile as any)?.matchedCount === 0) {
      throw new BadRequestException(
        "The post with that id does not exist in the system. Please try another id.",
      );
    }

    return this.get(_id);
  }

  /**
   * 删除situation根据id
   */
  public async delete(ids: string[]): Promise<IGenericMessageBody> {
    return this.situationModel
      .deleteMany({ _id: { $in: ids } })
      .then((post) => {
        if (post.deletedCount > 0) {
          return { message: `Deleted success from records.` };
        } else {
          throw new BadRequestException(`Failed to delete.`);
        }
      });
  }
}

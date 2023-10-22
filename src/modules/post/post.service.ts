import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { AppRoles } from "../app/app.roles";
import { PatchPostPayload } from "./payload/patch.post.payload";
import { IPost } from "./post.model";

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
 * Post Service
 */
@Injectable()
export class PostService {
  /**
   * Constructor
   * @param {Model<IPost>} postModel
   */
  constructor(@InjectModel("Post") private readonly postModel: Model<IPost>) {}

  /**
   * 获取所有的post
   */
  public async getAll(
    pageIndex: number,
    pageSize: number,
  ): Promise<PaginationResult<IPost[]>> {
    const totalRecords = await this.postModel.countDocuments();
    const totalPages = Math.ceil(totalRecords / pageSize);
    const actualPage = Math.min(Math.max(pageIndex, 1), totalPages);

    const skip = (actualPage - 1) * pageSize;

    const query = this.postModel
      .find()
      .select("_id name description fileName url")
      .skip(skip)
      .limit(pageSize);

    const data = await query.exec();

    return {
      data,
      totalRecords,
      totalPages,
      currentPage: actualPage,
      pageSize,
    };
  }

  /**
   * 获取单条post
   */
  public get(id: string): Promise<IPost> {
    return this.postModel.findById(id).exec();
  }

  /**
   * 新增一个post
   */
  public async create(payload: PatchPostPayload): Promise<IPost> {
    const createPost = new this.postModel({ ...payload });

    return createPost.save();
  }

  /**
   * 编辑post根据id
   */
  public async edit(payload: PatchPostPayload): Promise<IPost> {
    const { _id } = payload;
    const updatedProfile = await this.postModel.updateOne({ _id }, payload);

    if ((updatedProfile as any)?.matchedCount === 0) {
      throw new BadRequestException(
        "The post with that id does not exist in the system. Please try another id.",
      );
    }

    return this.get(_id);
  }

  /**
   * 删除post根据id
   */
  public async delete(ids: string[]): Promise<IGenericMessageBody> {
    return this.postModel.deleteMany({ _id: { $in: ids } }).then((post) => {
      if (post.deletedCount > 0) {
        return { message: `Deleted success from records.` };
      } else {
        throw new BadRequestException(`Failed to delete.`);
      }
    });
  }
}

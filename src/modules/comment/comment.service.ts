import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { AppRoles } from "../app/app.roles";
import { PatchCommentPayload } from "./payload/patch.comment.payload";
import { IComment } from "./comment.model";

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
 * Comment Service
 */
@Injectable()
export class CommentService {
  /**
   * Constructor
   * @param {Model<IComment>} commentModel
   */
  constructor(
    @InjectModel("Comment") private readonly commentModel: Model<IComment>,
  ) {}

  /**
   * 获取所有的评论
   */
  public async getAll(
    pageIndex: number,
    pageSize: number,
  ): Promise<PaginationResult<IComment[]>> {
    const totalRecords = await this.commentModel.countDocuments();
    const totalPages = Math.ceil(totalRecords / pageSize);
    const actualPage = Math.min(Math.max(pageIndex, 1), totalPages);

    const skip = (actualPage - 1) * pageSize;

    const query = this.commentModel
      .find()
      .select("_id accid content")
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
   * 获取单条评论
   */
  public get(id: string): Promise<IComment> {
    return this.commentModel.findById(id).exec();
  }

  /**
   * 新增一条评论
   */
  public async create(payload: PatchCommentPayload): Promise<IComment> {
    const createPost = new this.commentModel({ ...payload });

    return createPost.save();
  }

  /**
   * 删除post根据id
   */
  public async delete(ids: string[]): Promise<IGenericMessageBody> {
    return this.commentModel.deleteMany({ _id: { $in: ids } }).then((post) => {
      if (post.deletedCount > 0) {
        return { message: `Deleted success from records.` };
      } else {
        throw new BadRequestException(`Failed to delete.`);
      }
    });
  }
}

import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { AppRoles } from "../app/app.roles";
import { PatchArticlePayload } from "./payload/patch.article.payload";
import { IArticle } from "./article.model";

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
 * Article Service
 */
@Injectable()
export class ArticleService {
  /**
   * Constructor
   * @param {Model<IArticle>} articleModel
   */
  constructor(
    @InjectModel("Article")
    private readonly articleModel: Model<IArticle>,
  ) {}

  /**
   * 获取所有的动态
   */
  public async getAll(
    keyword: string,
    pageIndex: number,
    pageSize: number,
    isIndex: boolean,
  ): Promise<PaginationResult<IArticle[]>> {
    const totalRecords = await this.articleModel.countDocuments();
    const totalPages = Math.ceil(totalRecords / pageSize);
    const actualPage = Math.min(Math.max(pageIndex, 1), totalPages);
    const skip = (actualPage - 1) * pageSize;

    const query = this.articleModel
      .find({ $or: [{ title: { $regex: keyword, $options: "i" } }] })
      .select("_id title content author fileName time status isTop")
      .skip(skip)
      .limit(pageSize);

    let data = await query.exec();

    if (isIndex) {
      // 首页
      data = data.filter((situation) => situation.status === 1);
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
   * 获取单条article
   */
  public get(id: string): Promise<IArticle> {
    return this.articleModel.findById(id).exec();
  }

  /**
   * 新增一个article
   */
  public async create(payload: PatchArticlePayload): Promise<IArticle> {
    const createPost = new this.articleModel({ ...payload });

    return createPost.save();
  }

  /**
   * 编辑article根据id
   */
  public async edit(payload: PatchArticlePayload): Promise<IArticle> {
    const { _id } = payload;
    const updatedProfile = await this.articleModel.updateOne({ _id }, payload);

    if ((updatedProfile as any)?.matchedCount === 0) {
      throw new BadRequestException(
        "The post with that id does not exist in the system. Please try another id.",
      );
    }

    return this.get(_id);
  }

  /**
   * 删除article根据id
   */
  public async delete(ids: string[]): Promise<IGenericMessageBody> {
    return this.articleModel.deleteMany({ _id: { $in: ids } }).then((post) => {
      if (post.deletedCount > 0) {
        return { message: `Deleted success from records.` };
      } else {
        throw new BadRequestException(`Failed to delete.`);
      }
    });
  }
}

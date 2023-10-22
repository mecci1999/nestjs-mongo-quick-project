import { Schema, Document } from "mongoose";
import { AppRoles } from "modules/app/app.roles";

// Scheme
export const Article = new Schema({
  title: { type: String, require: true }, // 作品名称
  description: { type: String, require: false }, // 作品描述
  url: { type: String, require: true }, // 作品链接
  readAmount: { type: String, require: false }, // 作品阅读量
  time: { type: Number, require: true }, // 修改时间
  status: { type: Number, require: true, default: 0 }, // 动态状态
});

export class IArticle extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * name
   */
  title: string;
  /**
   * description
   */
  description: string;
  /**
   * url
   */
  url: string;
  /**
   * readAmount
   */
  readAmount: string;
  /**
   * time
   */
  time: number;
  /**
   * status
   */
  status: number;
}

import { Schema, Document } from "mongoose";
import { AppRoles } from "modules/app/app.roles";

// Scheme
export const Banner = new Schema({
  fileName: { type: String, require: false }, // 文件名
  mimetype: { type: String, require: false }, // 文件类型
  size: { type: Number, require: false }, // 文件大小
  jumpUrl: { type: String, require: false }, // 跳转链接
  order: { type: Number, require: false, default: 0 }, // banner图排序
});

export class IBanner extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * fileName
   */
  fileName: string;
  /**
   * mimetype
   */
  mimetype: string;
  /**
   * size
   */
  size: number;
  /**
   * jumpUrl
   */
  jumpUrl: string;
  /**
   * order
   */
  order: number;
}

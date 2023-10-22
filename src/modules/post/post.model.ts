import { Schema, Document } from "mongoose";
import { AppRoles } from "modules/app/app.roles";

// Scheme
export const Post = new Schema({
  name: { type: String, require: true }, // 作品名称
  description: { type: String, require: false }, // 作品描述
  fileName: { type: String, require: false }, // 文件名
  mimetype: { type: String, require: false }, // 文件类型
  size: { type: Number, require: false }, // 文件大小
  url: { type: String, require: true }, // 作品链接
});

export class IPost extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * name
   */
  name: string;
  /**
   * description
   */
  description: string;
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
   * url
   */
  url: string;
}

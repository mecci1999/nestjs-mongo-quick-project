import { Schema, Document } from "mongoose";
import { AppRoles } from "modules/app/app.roles";

// Scheme
export const Situation = new Schema({
  title: { type: String, require: true }, // 动态名称
  content: { type: String, require: true }, // 动态内容
  author: { type: String, require: true }, // 动态作者
  fileName: { type: String, require: false }, // 文件名
  mimetype: { type: String, require: false }, // 文件类型
  time: { type: Number, require: true }, // 修改时间
  status: { type: Number, require: true, default: 0 }, // 动态状态
  isTop: { type: Boolean, require: true, default: false }, // 置顶状态
});

export class ISituation extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * title
   */
  title: string;
  /**
   * content
   */
  content: string;
  /**
   * author
   */
  author: string;
  /**
   * fileName
   */
  fileName: string;
  /**
   * mimetype
   */
  mimetype: string;
  /**
   * time
   */
  time: number;
  /**
   * status
   */
  status: number;
  /**
   * isTop
   */
  isTop: boolean;
}

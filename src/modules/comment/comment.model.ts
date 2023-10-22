import { Schema, Document } from "mongoose";
import { AppRoles } from "modules/app/app.roles";

// Scheme
export const Comment = new Schema({
  accid: { type: String, require: true }, // 评论作者
  content: { type: String, require: true }, // 评论内容
});

export class IComment extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * accid
   */
  accid: string;
  /**
   * content
   */
  content: string;
}

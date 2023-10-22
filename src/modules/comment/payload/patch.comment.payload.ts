import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsAlphanumeric,
  IsUrl,
  IsNumber,
  IsString,
  IsEmpty,
} from "class-validator";

export class PatchCommentPayload {
  /**
   * uuid
   */
  _id?: string;

  /**
   * pageIndex field
   */
  @ApiProperty({
    required: false,
  })
  pageIndex?: number;

  /**
   * pageSize field
   */
  @ApiProperty({
    required: false,
  })
  pageSize?: number;

  /**
   * accid field
   */
  @ApiProperty({
    required: false,
  })
  accid?: string;

  /**
   * content field
   */
  @ApiProperty({
    required: false,
  })
  content?: string;
}

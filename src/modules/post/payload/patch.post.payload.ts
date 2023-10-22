import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsAlphanumeric,
  IsUrl,
  IsNumber,
  IsString,
  IsEmpty,
} from "class-validator";

export class PatchPostPayload {
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
   * name field
   */
  @ApiProperty({
    required: false,
  })
  name?: string;

  /**
   * description field
   */
  @ApiProperty({
    required: false,
  })
  description?: string;

  /**
   * fileName field
   */
  @ApiProperty({
    required: false,
  })
  fileName?: string;

  /**
   * mimetype field
   */
  @ApiProperty({
    required: false,
  })
  mimetype?: string;

  /**
   * size field
   */
  @ApiProperty({
    required: false,
  })
  size?: number;

  /**
   * url field
   */
  @ApiProperty({
    required: false,
  })
  url?: string;
}

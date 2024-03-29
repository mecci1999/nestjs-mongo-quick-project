import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsAlphanumeric,
  IsUrl,
  IsNumber,
  IsString,
} from "class-validator";

export class PatchBannerPayload {
  /**
   * uuid
   */
  _id?: string;

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
   * jumpUrl field
   */
  @ApiProperty({
    required: false,
  })
  @IsUrl()
  jumpUrl?: string;

  /**
   * order field
   */
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  order?: number;
}

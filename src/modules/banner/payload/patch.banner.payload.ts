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
  @IsAlphanumeric()
  @IsString()
  @IsNotEmpty()
  fileName: string;

  /**
   * mimetype field
   */
  @IsNotEmpty()
  mimetype: string;

  /**
   * mimetype field
   */
  @IsNotEmpty()
  size: number;

  /**
   * jumpUrl field
   */
  @ApiProperty({
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  jumpUrl: string;

  /**
   * order field
   */
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}

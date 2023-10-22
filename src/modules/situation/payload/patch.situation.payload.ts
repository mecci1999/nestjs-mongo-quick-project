import { ApiProperty } from "@nestjs/swagger";

export class PatchSituationPayload {
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
  keyword?: string;

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
   * title field
   */
  @ApiProperty({
    required: false,
  })
  title?: string;

  /**
   * title field
   */
  @ApiProperty({
    required: false,
  })
  content?: string;

  /**
   * title field
   */
  @ApiProperty({
    required: false,
  })
  author?: string;

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
   * time field
   */
  @ApiProperty({
    required: false,
  })
  time?: number;

  /**
   * status field
   */
  @ApiProperty({
    required: false,
  })
  status?: number;

  /**
   * status field
   */
  @ApiProperty({
    required: false,
  })
  isTop?: boolean;
}

import { ApiProperty } from "@nestjs/swagger";

export class PatchArticlePayload {
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
   * description field
   */
  @ApiProperty({
    required: false,
  })
  description?: string;

  /**
   * url field
   */
  @ApiProperty({
    required: false,
  })
  url?: string;

  /**
   * readAmount field
   */
  @ApiProperty({
    required: false,
  })
  readAmount?: string;

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
}

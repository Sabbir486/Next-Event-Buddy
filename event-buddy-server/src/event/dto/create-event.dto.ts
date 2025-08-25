import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsOptional,
  IsArray,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
    message: 'start_time must be in HH:MM:SS 24-hour format',
  })
  start_time: string;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
    message: 'end_time must be in HH:MM:SS 24-hour format',
  })
  end_time: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  location: string;

  @IsInt()
  @IsNotEmpty()
  total_seats: number;

  @IsInt()
  @IsOptional()
  available_seats?: number;

  @IsInt()
  @IsOptional()
  total_booked?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

import {
  IsInt,
  IsEmail,
  Min,
  IsEmpty,
  IsOptional,
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsOptional()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  event_id: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  status?: string;

  @IsInt()
  @Min(1)
  seat_booked: number;
}

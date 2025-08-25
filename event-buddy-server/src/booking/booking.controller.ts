import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Request,
  Header,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Role } from 'src/role/entities/role.entity';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Roles('Admin', 'User')
  @Post('create')
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    console.log('Request User:', req.user);
    return this.bookingService.create(createBookingDto, req);
  }

  @Auth(AuthType.None)
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Auth(AuthType.None)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Roles('Admin', 'User')
  @Get('user/:id')
  findUserBookings(@Param('id') id: string, @Request() req) {
    return this.bookingService.findUserBookings(+id);
  }

  @Roles('Admin', 'User')
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Roles('Admin', 'User')
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}

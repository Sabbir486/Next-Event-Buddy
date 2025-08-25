import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async create(createBookingDto: CreateBookingDto, req: any) {
    try {
      const { user_id, event_id, seat_booked } = createBookingDto;

      const id = req.user?.user_id || user_id;

      const user = await this.userRepo.findOneBy({ user_id: +id });
      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }

      const event = await this.eventRepo.findOneBy({ event_id: event_id });
      if (!event) {
        throw new NotFoundException(`Event with ID ${event_id} not found`);
      }

      if (seat_booked > event.available_seats) {
        throw new BadRequestException(
          `Not enough seats available. Available: ${event.available_seats}, Requested: ${seat_booked}`,
        );
      }

      const booking = this.bookingRepo.create({
        user,
        event,
        seat_booked,
      });

      event.available_seats -= seat_booked;
      event.total_booked += seat_booked;

      await this.eventRepo.save(event);
      const savedBooking = await this.bookingRepo.save(booking);

      return {
        booking: savedBooking,
        event,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Failed to create booking',
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      return await this.bookingRepo.find({
        relations: ['event'],
      });
    } catch (error) {
      return { message: 'Failed to fetch bookings', error: error.message };
    }
  }

  async findOne(id: number) {
    try {
      const booking = await this.bookingRepo.findOne({
        where: { booking_id: id },
        relations: ['event'],
      });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }
      return booking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    try {
      const booking = await this.bookingRepo.findOne({
        where: { booking_id: id },
        relations: ['event'],
      });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      if (updateBookingDto.seat_booked) {
        const seatDiff = updateBookingDto.seat_booked - booking.seat_booked;
        if (seatDiff > booking.event.available_seats) {
          throw new BadRequestException(
            `Not enough seats available. Available: ${booking.event.available_seats}, Requested: ${seatDiff}`,
          );
        }

        booking.event.available_seats -= seatDiff;
        booking.event.total_booked += seatDiff;
        await this.eventRepo.save(booking.event);
      }

      if (updateBookingDto.status) {
        booking.status = updateBookingDto.status;
        if (updateBookingDto.status === 'Cancelled') {
          booking.event.available_seats += booking.seat_booked;
          booking.event.total_booked -= booking.seat_booked;
          await this.eventRepo.save(booking.event);
        }
      }

      Object.assign(booking, updateBookingDto);
      return this.bookingRepo.save(booking);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Failed to update booking',
        error: error.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const booking = await this.bookingRepo.findOne({
        where: { booking_id: id },
        relations: ['event'],
      });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      if (booking.event != null) {
        const event = await this.eventRepo.findOneBy({
          event_id: booking.event.event_id,
        });
        if (
          event &&
          booking.status != 'Cancelled' &&
          booking.status != 'Completed'
        ) {
          event.available_seats += booking.seat_booked;
          event.total_booked -= booking.seat_booked;
          await this.eventRepo.save(event);
        }
      }

      await this.bookingRepo.remove(booking);
      return { deleted: true, message: `Booking #${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Failed to delete booking',
        error: error.message,
      });
    }
  }

  async findUserBookings(userId: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { user_id: userId },
        relations: ['bookings', 'bookings.event'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return user.bookings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Failed to fetch user bookings',
        error: error.message,
      });
    }
  }
}

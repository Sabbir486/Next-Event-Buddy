import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  booking_id: number;

  @Column({ type: 'int', nullable: false })
  seat_booked: number;

  @Column({ type: 'varchar', length: 50, default: 'Active' })
  status: string;

  @ManyToOne(() => User, (user) => user.bookings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'event_id' })
  event: Event;
}

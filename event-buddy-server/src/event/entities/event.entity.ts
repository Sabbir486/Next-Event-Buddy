import { Booking } from 'src/booking/entities/booking.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  event_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'time', nullable: false })
  start_time: string;

  @Column({ type: 'time', nullable: false })
  end_time: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  location: string;

  @Column({ type: 'int', nullable: false })
  total_seats: number;

  @Column({ type: 'int', nullable: false })
  available_seats: number;

  @Column({ type: 'int', nullable: false })
  total_booked: number;

  @Column({ nullable: false })
  image_path: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}

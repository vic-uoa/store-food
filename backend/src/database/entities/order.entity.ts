import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_no', length: 40, unique: true })
  orderNo!: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: number;

  @Column({ type: 'enum', enum: ['pending_payment', 'paid', 'shipped', 'completed', 'canceled'], default: 'pending_payment' })
  status!: 'pending_payment' | 'paid' | 'shipped' | 'completed' | 'canceled';

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: string;

  @Column({ name: 'pay_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  payAmount?: string;

  @Column({ name: 'pay_method', length: 20, nullable: true })
  payMethod?: string | null;

  @Column({ name: 'address_snapshot', type: 'json', nullable: true })
  addressSnapshot?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'paid_at', type: 'datetime', nullable: true })
  paidAt?: Date | null;

  @Column({ name: 'shipped_at', type: 'datetime', nullable: true })
  shippedAt?: Date | null;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt?: Date | null;

  @Column({ name: 'canceled_at', type: 'datetime', nullable: true })
  canceledAt?: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

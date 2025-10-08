import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'points_ledger' })
export class PointsLedger {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: number;

  @Column({ type: 'int' })
  delta!: number;

  @Column({ length: 64 })
  reason!: string;

  @Column({ name: 'ref_id', length: 64, nullable: true })
  refId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

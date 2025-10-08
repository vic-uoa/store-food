import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'points_rules' })
export class PointsRule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'ratio_amount', type: 'decimal', precision: 10, scale: 2 })
  ratioAmount!: string;

  @Column({ name: 'ratio_point', type: 'int' })
  ratioPoint!: number;

  @Column({ type: 'tinyint', default: 1 })
  enabled!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

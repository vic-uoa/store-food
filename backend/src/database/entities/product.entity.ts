import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 128 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: string;

  @Column({ name: 'image_urls', type: 'json', nullable: true })
  imageUrls?: string[];

  @Column({ name: 'category_id', type: 'bigint', nullable: true })
  categoryId?: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ type: 'enum', enum: ['on_shelf', 'off_shelf', 'deleted'], default: 'off_shelf' })
  status!: 'on_shelf' | 'off_shelf' | 'deleted';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

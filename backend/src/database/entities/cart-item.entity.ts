import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: number;

  @Column({ name: 'product_id', type: 'bigint' })
  productId!: number;

  @Column({ type: 'int' })
  qty!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

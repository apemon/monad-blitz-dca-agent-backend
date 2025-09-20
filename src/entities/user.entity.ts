import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 42,
    comment: 'EVM wallet address (0x followed by 40 hex characters)',
  })
  walletAddress: string;

  @Column({
    unique: true,
    comment: 'telegram user id',
  })
  telegramId: string;

  @Column({
    length: 66,
    comment: 'Private key (0x followed by 64 hex characters)',
  })
  @Exclude() // Exclude from serialization for security
  privateKey: string;

  @Column({ default: '0' })
  usdcBalance: string;

  @Column({ default: '0' })
  monadBalance: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

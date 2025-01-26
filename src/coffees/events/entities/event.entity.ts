import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}

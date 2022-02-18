import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SearchCache {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameFilter: string;

  @Column()
  yearFilter: string;

  @Column()
  date: Date;

  @Column()
  page: number;

  @Column()
  totalResults: number;
}

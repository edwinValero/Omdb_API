import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryColumn()
  imdbID: string;

  @Column()
  name: string;

  @Column()
  year: string;

  @Column()
  type: string;

  @Column()
  image: string;
}

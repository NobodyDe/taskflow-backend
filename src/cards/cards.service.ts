import { columns } from './../db/schema/columns';
import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { DrizzleService } from 'src/db/drizzle.provider';
import { asc, eq } from 'drizzle-orm';
import { cards } from 'src/db/schema';

@Injectable()
export class CardsService {
  constructor(private readonly drizzle: DrizzleService) {}
  create(createCardDto: CreateCardDto) {
    return 'This action adds a new card';
  }

  async findAll(columnId) {
    const cardsByColumns = await this.drizzle.db.query.cards.findMany({
      where: eq(cards.column_id, columnId),
      orderBy: [asc(cards.position)],
    });

    return cardsByColumns;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}

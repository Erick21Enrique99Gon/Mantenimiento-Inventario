import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditorialService } from './editorial.service';
import { EditorialController } from './editorial.controller';
import { Editorial } from './entities/editorial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Editorial])],
  controllers: [EditorialController],
  providers: [EditorialService],
})
export class EditorialModule {}

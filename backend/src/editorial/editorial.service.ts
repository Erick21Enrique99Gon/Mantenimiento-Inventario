import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEditorialDto } from './dto/create-editorial.dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';
import { Editorial } from './entities/editorial.entity';

@Injectable()
export class EditorialService {
  constructor(
    @InjectRepository(Editorial)
    private readonly editorialRepository: Repository<Editorial>,
  ) {}

  async create(createEditorialDto: CreateEditorialDto): Promise<Editorial> {
    const editorial = this.editorialRepository.create(createEditorialDto);
    return await this.editorialRepository.save(editorial);
  }

  async findAll(): Promise<Editorial[]> {
    return await this.editorialRepository.find();
  }

  async findOne(id: number): Promise<Editorial> {
    return await this.editorialRepository.findOneOrFail({ where: { editorialId: id } });
  }

  async update(id: number, updateEditorialDto: UpdateEditorialDto): Promise<Editorial> {
    await this.editorialRepository.update(id, updateEditorialDto);
    return await this.editorialRepository.findOneOrFail({ where: { editorialId: id } });
  }

  async remove(id: number): Promise<void> {
    await this.editorialRepository.delete(id);
  }
}

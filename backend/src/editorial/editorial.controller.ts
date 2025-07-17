import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EditorialService } from './editorial.service';
import { CreateEditorialDto } from './dto/create-editorial.dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';

@Controller('editorial')
export class EditorialController {
  constructor(private readonly editorialService: EditorialService) {}

  @Post()
  async create(@Body() createEditorialDto: CreateEditorialDto) {
    return await this.editorialService.create(createEditorialDto);
  }

  @Get()
  async findAll() {
    return await this.editorialService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.editorialService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEditorialDto: UpdateEditorialDto) {
    return await this.editorialService.update(+id, updateEditorialDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.editorialService.remove(+id);
  }
}

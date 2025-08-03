import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { UserMessagesService, CreateUserMessageDto, PaginationDto } from './user-messages.service';

@Controller('user-messages')
export class UserMessagesController {
  constructor(private readonly userMessagesService: UserMessagesService) {}

  @Post()
  create(@Body() createUserMessageDto: CreateUserMessageDto) {
    return this.userMessagesService.create(createUserMessageDto);
  }

  @Get()
  findAll() {
    return this.userMessagesService.findAll();
  }

  @Post('paginated')
  findAllPaginated(@Body() paginationDto: PaginationDto) {
    return this.userMessagesService.findAllPaginated(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const message = await this.userMessagesService.findOne(id);
    if (!message) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }
    return message;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserMessageDto: CreateUserMessageDto
  ) {
    const message = await this.userMessagesService.update(id, updateUserMessageDto);
    if (!message) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }
    return message;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.userMessagesService.remove(id);
    if (!deleted) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Message deleted successfully' };
  }
} 
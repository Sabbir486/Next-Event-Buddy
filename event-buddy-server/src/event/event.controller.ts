import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Roles('Admin')
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createEventDto: CreateEventDto, @Res() res: Response) {
    try {
      const createdEvent = await this.eventService.create(createEventDto);
      return res.status(HttpStatus.CREATED).json(createdEvent);
    } catch (error) {
      return res.status(error.status || 500).json({
        statusCode: error.status || 500,
        message: error.message || 'Internal server error',
      });
    }
  }

  @Roles('Admin')
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.eventService.uploadImage(file);
  }

  @Auth(AuthType.None)
  @Get()
  async findAll() {
    return await this.eventService.findAll();
  }

  @Auth(AuthType.None)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.eventService.findOne(+id);
  }

  @Roles('Admin')
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Res() res: Response,
  ) {
    try {
      const updatedEvent = await this.eventService.update(+id, updateEventDto);
      return res.status(HttpStatus.OK).json(updatedEvent);
    } catch (error) {
      return res.status(error.status || 500).json({
        statusCode: error.status || 500,
        message: error.message || 'Internal server error',
      });
    }
  }

  @Roles('Admin')
  @Delete('delete/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.eventService.remove(+id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({
        statusCode: error.status || 500,
        message: error.message || 'Internal server error',
      });
    }
  }
}

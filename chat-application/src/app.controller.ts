import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PromptBody } from './dto/prompt.dto';
import { HttpExceptionFilter } from './filters/exception.filter';

@Controller()
@UseFilters(new HttpExceptionFilter())
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @HttpCode(HttpStatus.OK)
  @Post('prompt')
  getPromptResponse(@Body() body: PromptBody) {
    return this.appService.getPromptResponse(body.prompt);
  }
}

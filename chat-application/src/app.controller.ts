import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
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
  async getPromptResponse(@Body() body: PromptBody) {
    try {
      const { response, title } = await this.appService.getPromptResponse(
        body.prompt,
      );

      // Create a new chat session
      const chatSession = await this.appService.createChatSession(title);

      // Save the message to the chat session
      await this.appService.createMessage(
        chatSession.id,
        body.prompt,
        response,
      );
      return { response, title, chatSessionId: chatSession.id };
    } catch (error) {
      console.error('Error in getPromptResponse:', error);
      throw new InternalServerErrorException(
        'Failed to process prompt response',
      );
    }
  }

  @Post('chat-sessions/:id/messages')
  async addMessageToChatSession(
    @Param('id') chatSessionId: string,
    @Body() body: PromptBody,
  ) {
    try {
      const chatSessionIdNum = parseInt(chatSessionId, 10);
      const { response, title } = await this.appService.getPromptResponse(
        body.prompt,
      );

      // Save the message to the chat session
      const message = await this.appService.createMessage(
        chatSessionIdNum,
        body.prompt,
        response,
      );

      return { response, title, message };
    } catch (error) {
      console.error('Error in addMessageToChatSession:', error);
      throw new InternalServerErrorException(
        'Failed to add message to chat session',
      );
    }
  }

  @Get('chat-sessions')
  async getChatSessions() {
    try {
      return this.appService.getChatSessions();
    } catch (error) {
      console.error('Error in getChatSessions:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve chat sessions',
      );
    }
  }

  @Get('chat-sessions/:id')
  async getMessagesByChatSessionId(@Param('id') chatSessionId: string) {
    try {
      const chatSessionIdNum = parseInt(chatSessionId, 10);
      const chatSession =
        await this.appService.getMessagesByChatSessionId(chatSessionIdNum);
      return chatSession;
    } catch (error) {
      console.error('Error in getMessagesByChatSessionId:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve messages for chat session',
      );
    }
  }

  @Delete('chat-sessions/:id')
  async deleteChatSession(@Param('id') chatSessionId: string) {
    try {
      const chatSessionIdNum = parseInt(chatSessionId, 10);

      await this.appService.deleteChatSession(chatSessionIdNum);
      return { message: 'Chat session deleted successfully' };
    } catch (error) {
      console.error('Error in deleteChatSession:', error);
      throw new InternalServerErrorException('Failed to delete chat session');
    }
  }
}

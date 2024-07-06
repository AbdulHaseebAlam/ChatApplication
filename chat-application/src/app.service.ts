/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatSession, Message, PrismaClient } from '@prisma/client';
import { marked } from 'marked';

@Injectable()
export class AppService {
  private prisma: PrismaClient;
  private genAI: any;
  private geminiPro: any;
  private hrInstruction: string;

  constructor(private readonly config: ConfigService) {
    this.prisma = new PrismaClient();
    this.genAI = new GoogleGenerativeAI(this.config.get('API_KEY'));

    this.geminiPro = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    this.hrInstruction = this.config.get<string>('HR_INSTRUCTION');
  }

  getHello(): string {
    return 'Hello World!';
  }

  async createChatSession(title: string): Promise<ChatSession> {
    try {
      return await this.prisma.chatSession.create({
        data: {
          title,
        },
      });
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw new InternalServerErrorException('Failed to create chat session');
    }
  }

  async createMessage(
    chatSessionId: number,
    userPrompt: string,
    apiResponse: string,
  ): Promise<Message> {
    try {
      return await this.prisma.message.create({
        data: {
          chatSessionId,
          userPrompt,
          apiResponse,
        },
      });
    } catch (error) {
      console.error('Error creating message:', error);
      throw new InternalServerErrorException('Failed to create message');
    }
  }

  async getPromptResponse(
    prompt: string,
  ): Promise<{ response: string; title: string }> {
    const fullprompt = `${this.hrInstruction} ${prompt}`;
    try {
      const result = await this.geminiPro.generateContent(fullprompt);
      const response = await result.response;
      const text = response.text();

      const parsedText = await marked(text);

      const title = this.generateTitle(prompt, text);

      return { response: parsedText, title };
    } catch (error) {
      console.error('Error generating prompt response:', error);
      throw new InternalServerErrorException(
        'Failed to generate prompt response',
      );
    }
  }

  private generateTitle(prompt: string, response: string): string {
    return `${prompt.split(' ').slice(0, 20).join(' ')}...`;
  }

  async getChatSessions(): Promise<ChatSession[]> {
    try {
      return await this.prisma.chatSession.findMany({
        include: { messages: true },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error retrieving chat sessions:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve chat sessions',
      );
    }
  }

  async getMessagesByChatSessionId(
    chatSessionId: number,
  ): Promise<ChatSession> {
    try {
      return await this.prisma.chatSession.findUnique({
        where: { id: chatSessionId },
        include: { messages: true },
      });
    } catch (error) {
      console.error('Error retrieving messages for chat session:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve messages for chat session',
      );
    }
  }

  async deleteChatSession(chatSessionId: number): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.message.deleteMany({
          where: {
            chatSessionId,
          },
        });
        await prisma.chatSession.delete({
          where: {
            id: chatSessionId,
          },
        });
      });
    } catch (error) {
      console.error('Error deleting chat session:', error);
      throw new InternalServerErrorException('Failed to delete chat session');
    }
  }
}

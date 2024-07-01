import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private genAI: any;
  private geminiPro: any;
  constructor(private readonly config: ConfigService) {
    this.genAI = new GoogleGenerativeAI(this.config.get('API_KEY'));

    this.geminiPro = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getPromptResponse(prompt: string): Promise<string> {
    try {
      const result = await this.geminiPro.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      // console.log(text);
      return text;
    } catch (error) {
      console.error('Error generating prompt response:', error);
      throw new InternalServerErrorException(
        'Failed to generate prompt response',
      );
    }
  }
}

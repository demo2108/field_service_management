import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailConfig } from './entities/mail-config.entity';
import { Repository } from 'typeorm';
import { CreateMailConfigDto } from './dto/create-mail-config.dto';

@Injectable()
export class MailConfigsService {
     constructor(
    @InjectRepository(MailConfig)
    private readonly mailConfigRepository: Repository<MailConfig>,
  ) {}

  async update(id: number, dto: CreateMailConfigDto): Promise<{
    statusCode: number;
    message: string;
    data: MailConfig | null;
  }> {
    const mailConfig = await this.mailConfigRepository.findOne({ where: { id } });

    if (!mailConfig) {
      return {
        statusCode: 404,
        message: `Mail config with ID ${id} not found`,
        data: null,
      };
    }

    const updated = this.mailConfigRepository.merge(mailConfig, {
      ...dto,
      updated_at: new Date(),
    });

    const saved = await this.mailConfigRepository.save(updated);

    return {
      statusCode: 200,
      message: 'Mail config updated successfully',
      data: saved,
    };
  }

  async findOne(id: number): Promise<{
  statusCode: number;
  message: string;
  data: MailConfig | null;
}> {
  const mailConfig = await this.mailConfigRepository.findOne({ where: { id } });

  if (!mailConfig) {
    return {
      statusCode: 404,
      message: `Mail config with ID ${id} not found`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: 'Mail config fetched successfully',
    data: mailConfig,
  };
}
}

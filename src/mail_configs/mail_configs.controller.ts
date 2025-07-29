import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { MailConfigsService } from './mail_configs.service';
import { CreateMailConfigDto } from './dto/create-mail-config.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('mail-configs')
export class MailConfigsController {
     constructor(private readonly mailConfigService: MailConfigsService) {}
 @UseGuards(AuthGuard('jwt'))
@Put(':id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() CreateMailConfigDto: CreateMailConfigDto,
) {
  return this.mailConfigService.update(id, CreateMailConfigDto);
}
 @UseGuards(AuthGuard('jwt'))
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.mailConfigService.findOne(id);
}
}

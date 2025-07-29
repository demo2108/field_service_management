import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PartRequestsService } from './part_requests.service';
import { CreatePartRequestDto } from './dto/create-part-request.dto';
import { UpdatePartRequestDto } from './dto/update-part-request.dto';
import { writeFileSync } from 'fs';
import { matches } from 'class-validator';
import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; 
import { AuthGuard } from '@nestjs/passport';


@Controller('part-requests')
export class PartRequestsController {
     constructor(private readonly partRequestService: PartRequestsService) {}
 @UseGuards(AuthGuard('jwt'))
@Post()
async create(@Body() createDto: CreatePartRequestDto) {
  let image_path: string | undefined = undefined;

  if (createDto.image_path) {
    const matches = createDto.image_path.match(/^data:(.*);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
      return {
        statusCode: 400,
        message: 'Invalid image_path format',
        data: null,
      };
    }

    const ext = matches[1].split('/')[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');
    const fileName = `${uuidv4()}.${ext}`;

    const folderPath = join(__dirname, '..', '..', 'public', 'uploads', 'part');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = join(folderPath, fileName);
    writeFileSync(filePath, buffer);

    const serverUrl = 'http://localhost:3001';
    image_path = `${serverUrl}/uploads/part/${fileName}`;

    console.log('Image saved at:', image_path);
  }

  return this.partRequestService.create({ ...createDto, image_path });
}

 @UseGuards(AuthGuard('jwt'))
@Get('all')
findAll(@Query('page') page = 1) {
  return this.partRequestService.findAll(Number(page));
}
 @UseGuards(AuthGuard('jwt'))
@Get('filter')
async findByFilters(
  @Query('id') id?: string,
  @Query('work_order_id') work_order_id?: string,
  @Query('engineer_id') engineer_id?: string,
  @Query('part_name') part_name?: string,
  @Query('quantity') quantity?: string,
  @Query('request_status') request_status?: string,
  @Query('approved_by') approved_by?: string,
  @Query('request_date') request_date?: string,
  @Query('approval_date') approval_date?: string,
    @Query('location_id') location_id?: string,
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  return this.partRequestService.findByFilters(
    {
      id: id ? Number(id) : undefined,
      work_order_id: work_order_id ? Number(work_order_id) : undefined,
      engineer_id: engineer_id ? Number(engineer_id) : undefined,
      part_name,
      quantity: quantity ? Number(quantity) : undefined,
      request_status,
      approved_by: approved_by ? Number(approved_by) : undefined,
      request_date,
      approval_date,
        location_id: location_id ? Number(location_id) : undefined,
    },
    Number(page),
    Number(limit),
  );
}
//GET /part-requests/filter?part_name=bolt&request_status=Pending
 @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const partRequest = await this.partRequestService.findOne(id);
    if (!partRequest) {
      throw new NotFoundException(`PartRequest with id ${id} not found`);
    }
    return partRequest;
  }
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
async update(@Param('id') id: number, @Body() updateDto: UpdatePartRequestDto) {
  let image_path: string | undefined = undefined;

  if (updateDto.image_path) {
    const matches = updateDto.image_path.match(/^data:(.*);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
      return {
        statusCode: 400,
        message: 'Invalid base64_image format',
        data: null,
      };
    }

    const ext = matches[1].split('/')[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');
    const fileName = `${uuidv4()}.${ext}`;

    const folderPath = join(__dirname, '..', '..', 'public', 'uploads', 'part');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = join(folderPath, fileName);
    writeFileSync(filePath, buffer);

    const serverUrl = 'http://localhost:3001';
    image_path = `${serverUrl}/uploads/part/${fileName}`;
  }

  return this.partRequestService.update(id, {
    ...updateDto,
    ...(image_path && { image_path }),
  });
}
 @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.partRequestService.remove(id);
  }
   @UseGuards(AuthGuard('jwt'))
   @Post('search')
  searchPart(@Body() body: {
    Page: number;
    PageSize: number;
    StartDate?: string;
    EndDate?: string;
    Search?: string;
    location_id?: number;
      // Work_order_id?: number;

     
   
  }) {
    return this.partRequestService.searchWithPagination(body);
  }  
}

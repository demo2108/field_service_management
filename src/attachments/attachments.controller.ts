import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { AttachmentsService } from './attachments.service';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import fileType, { fromBuffer } from 'file-type';

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'
import { AuthGuard } from '@nestjs/passport';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SignatureMaster } from './entities/signature_master.entity';
import { Repository } from 'typeorm';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { ServiceRequest } from 'src/service_request/entities/service-request.entity';


@Controller('attachments')
export class AttachmentsController {
      constructor(private readonly attachmentService: AttachmentsService,
        @InjectRepository(SignatureMaster)
  private readonly signatureRepo: Repository<SignatureMaster>,
          @InjectRepository(WorkOrder)
  private readonly workOrderRepo: Repository<WorkOrder>,
            @InjectRepository(ServiceRequest)
  private readonly ServiceRequestrepo: Repository<ServiceRequest>,
      ) {}
@UseGuards(AuthGuard('jwt'))

@Post()
@UsePipes(new ValidationPipe({ transform: true }))
async uploadBase64Files(@Body() body: CreateAttachmentDto) {
  const { base64_files, service_request_id, work_order_id } = body;

  if (!base64_files || !Array.isArray(base64_files) || base64_files.length === 0) {
    return { statusCode: 400, message: 'base64_files array is required' };
  }

  if (!service_request_id) {
    return { statusCode: 400, message: 'service_request_id  are required' };
  }

  try {

const firstBuffer = Buffer.from(base64_files[0], 'base64');
const fileTypeResult = await fromBuffer(firstBuffer);

if (!fileTypeResult) {
  return {
    statusCode: 400,
    message: 'Unable to detect file type from first base64 content',
  };
}

const { mime: firstMime } = fileTypeResult;

const workOrderData = await this.workOrderRepo.findOne({ where: { id: work_order_id } });
const serviceRequestData = await this.ServiceRequestrepo.findOne({ where: { id: service_request_id } });

let folderName = '';
const isWorkOrderIdInRequest = body.hasOwnProperty('work_order_id') && body.work_order_id;

if (isWorkOrderIdInRequest && workOrderData?.workorder_id) {
  folderName = workOrderData.workorder_id;
} else if (serviceRequestData?.service_request_num) {
  folderName = serviceRequestData.service_request_num;
} else {
  return {
    statusCode: 400,
    message: 'Unable to determine folder name from work order or service request',
  };
}


// 🔽 Folder path creation
const uploadBasePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'attachment');
const folderPath = path.join(uploadBasePath, folderName);

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

        const attachmentData = {
      ...body,
      base64_file: base64_files[0],
      file_type: firstMime,
        service_request_id,
      work_order_id,
      // Remove file_url here to avoid storing in DB if not needed
    };

    const attachment = await this.attachmentService.create(attachmentData);

    if (!attachment || !attachment.data || !attachment.data.id) {
      return {
        statusCode: 400,
        message: 'Failed to create attachment',
        details: attachment?.message || 'No data returned',
      };
    }

    const attachmentId = attachment.data.id;
    const uploadedSignatures: any[] = [];

    // ✅ Now store all files into signature_master
    for (const base64_file of base64_files) {
      const buffer = Buffer.from(base64_file, 'base64');
      const fileType = await fromBuffer(buffer);
      const ext = fileType?.ext || 'png';
      const fileName = `${uuidv4()}.${ext}`;
      // const sigPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'attachment', fileName);
      // fs.writeFileSync(sigPath, buffer);

      // const signatureUrl = `uploads/attachment/${fileName}`;
      const sigFilePath = path.join(folderPath, fileName);
fs.writeFileSync(sigFilePath, buffer);
const signatureUrl = `uploads/attachment/${folderName}/${fileName}`;


      const signature = this.signatureRepo.create({
        attachment_id: attachmentId,
        work_order_id,
        service_request_id,
        signature_path: signatureUrl,
      });

      await this.signatureRepo.save(signature);
      uploadedSignatures.push(signature);
    }

    return {
      statusCode: 201,
      message: '1 Attachment and multiple Signatures stored successfully',
      data: {
        attachment: attachment.data,
        signatures: uploadedSignatures,
      },
    };
  } catch (err) {
    console.error('Upload error:', err);
    return {
      statusCode: 500,
      message: 'Failed to upload files',
      error: err.message || err,
    };
  }
}

 @UseGuards(AuthGuard('jwt'))
@Put(':id')
async updateAttachment(
  @Param('id', ParseIntPipe) id: number,
  @Body() body: any,
) {
  const {
    base64_files,
    service_request_id,
    work_order_id,
    updated_by,
  } = body;

  if (!Array.isArray(base64_files) || base64_files.length === 0) {
    return { statusCode: 400, message: '`base64_files` array is required' };
  }

  if (!updated_by) {
    return { statusCode: 400, message: '`updated_by` is required' };
  }

  try {
    const firstBuffer = Buffer.from(base64_files[0], 'base64');
    const fileTypeResult = await fromBuffer(firstBuffer);

    if (!fileTypeResult) {
      return { statusCode: 400, message: 'Unable to detect file type from base64' };
    }

    const { mime: firstMime } = fileTypeResult;

    const workOrderData = work_order_id
      ? await this.workOrderRepo.findOne({ where: { id: work_order_id } })
      : null;

    const serviceRequestData = service_request_id
      ? await this.ServiceRequestrepo.findOne({ where: { id: service_request_id } })
      : null;

    let folderName = '';
if (work_order_id) {
  const workOrderData = await this.workOrderRepo.findOne({ where: { id: work_order_id } });

  if (workOrderData?.workorder_id) {
    folderName = workOrderData.workorder_id;
  } else {
    // fallback to default format if not found
    //folderName = `WO-${this.generateRandomString()}`;
    console.log("issue");
  }

} else if (service_request_id) {
  const serviceRequestData = await this.ServiceRequestrepo.findOne({ where: { id: service_request_id } });

  if (serviceRequestData?.service_request_num) {
    folderName = serviceRequestData.service_request_num;
  } else {
        console.log("issue");
    // fallback to default format if not found
    //folderName = `SR-${this.generateRandomString()}`;
  }

} else {
  return {
    statusCode: 400,
    message: 'Either work_order_id or service_request_id is required',
  };
}


    const uploadBasePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'attachment');
    const folderPath = path.join(uploadBasePath, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save all files
    const fileNames: string[] = [];
    for (const base64 of base64_files) {
      const buffer = Buffer.from(base64, 'base64');
      const { ext } = (await fromBuffer(buffer)) || { ext: 'png' };
      const fileName = `${uuidv4()}.${ext}`;
      const filePath = path.join(folderPath, fileName);
      fs.writeFileSync(filePath, buffer);
      fileNames.push(`uploads/attachment/${folderName}/${fileName}`);
    }

    const updatePayload = {
      ...body,
      base64_file: base64_files[0], // for DB record, only store 1 as main
      file_type: firstMime,
      file_url: fileNames[0],
    };

    const result = await this.attachmentService.updateAttachment(id, updatePayload);

    // Optionally update signature paths if you want:
    // You can add a `signatureRepo.update(...)` or save new signatures here too.

    return result;
  } catch (err) {
    console.error('Update error:', err);
    return {
      statusCode: 500,
      message: 'Failed to update attachment',
      error: err.message || err,
    };
  }
}

// @Put(':id')
// async updateAttachment(
//   @Param('id', ParseIntPipe) id: number,
//   @Body() body: any
// ) {
//   const { base64_file } = body;

//   let file_url: string | undefined;

//   if (base64_file) {
//     let buffer: Buffer;
//     try {
//       buffer = Buffer.from(base64_file, 'base64');
//       if (!buffer || !buffer.length) {
//         return { statusCode: 400, message: 'Invalid base64 data' };
//       }
//     } catch (err) {
//       return { statusCode: 400, message: 'Failed to decode base64 data' };
//     }

//     // 🔍 Auto-detect MIME type and extension
//     const fileTypeResult = await fromBuffer(buffer);
//     if (!fileTypeResult) {
//       return { statusCode: 400, message: 'Unable to detect file type from base64 data' };
//     }

//     const { ext, mime } = fileTypeResult;

//     // Generate file path
//     const fileName = `${uuidv4()}.${ext}`;
//     const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'attachment', fileName);

//     fs.writeFileSync(filePath, buffer);
//     file_url = `uploads/attachment/${fileName}`;

//     // Inject detected MIME into body (optional)
//     body.file_type = mime;
//   }

//   const updateData = {
//     ...body,
//     ...(file_url && { file_url }),
//   };

//   return this.attachmentService.updateAttachment(id, updateData);
// }
 @UseGuards(AuthGuard('jwt'))
  @Get('all')
async findAllAttachments() {
  return this.attachmentService.findAllAttachments();
}
 @UseGuards(AuthGuard('jwt'))
@Delete(':id')
async deleteAttachment(@Param('id', ParseIntPipe) id: number) {
  return this.attachmentService.deleteAttachment(id);
}
 @UseGuards(AuthGuard('jwt'))
@Post('search')
searchattechment(@Body() body: {
  Page: number;
  PageSize: number;
  StartDate?: string;
  EndDate?: string;
  Search?: string;
 work_order_id?: number;
 // location_id?: number;
}) {
  return this.attachmentService.searchWithPagination(body);
}


}



import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { Repository } from 'typeorm';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { User } from 'src/users/entities/user.entity';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import * as fs from 'fs';
import * as path from 'path';
import { ServiceRequest } from 'src/service_request/entities/service-request.entity';
import { SignatureMaster } from './entities/signature_master.entity';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { EventLog } from 'src/engineer_event_log/entities/event_log.entity';


@Injectable()
export class AttachmentsService {
     constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
      @InjectRepository(User)
  private readonly userRepo: Repository<User>,

  @InjectRepository(WorkOrder)
  private readonly workOrderRepo: Repository<WorkOrder>,
  @InjectRepository(ServiceRequest)
  private readonly ServiceRequestrepo: Repository<ServiceRequest>,
    @InjectRepository(SignatureMaster)
  private readonly signatureMasterRepository: Repository<SignatureMaster>,
  @InjectRepository(EventLog)
  private eventLogRepo: Repository<EventLog>,
  ) {}
async create(dto: CreateAttachmentDto): Promise<any> {
  const requiredFields = ['location_id', 'base64_file'];

  for (const field of requiredFields) {
    if (!dto[field]) {
      return {
        statusCode: 400,
        message: `${field} is required`,
        data: null,
      };
    }
  }

  const { work_order_id, uploaded_by, created_by ,service_request_id} = dto;

  // ✅ Validate created_by
  if (!created_by || typeof created_by !== 'number') {
    return {
      statusCode: 400,
      message: '`created_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

  // ✅ Validate work_order_id
  if (work_order_id) {
    const workOrder = await this.workOrderRepo.findOne({ where: { id: work_order_id } });
    if (!workOrder) {
      return {
        statusCode: 400,
        message: `Invalid work_order_id: ${work_order_id}`,
        data: null,
      };
    }
  }

    if (service_request_id) {
    const service_request = await this.ServiceRequestrepo.findOne({ where: { id: service_request_id } });
    if (!service_request) {
      return {
        statusCode: 400,
        message: `Invalid service_request_id: ${service_request}`,
        data: null,
      };
    }
  }

  // ✅ Validate uploaded_by
  if (uploaded_by) {
    const user = await this.userRepo.findOne({ where: { id: uploaded_by } });
    if (!user) {
      return {
        statusCode: 400,
        message: `Invalid uploaded_by user ID: ${uploaded_by}`,
        data: null,
      };
    }
  }

  // ✅ Validate and assign created_by
  const creator = await this.userRepo.findOne({ where: { id: created_by } });
  if (!creator) {
    return {
      statusCode: 400,
      message: `Invalid created_by user ID: ${created_by}`,
      data: null,
    };
  }

  // ✅ Create and assign relations manually
  const attachment = this.attachmentRepo.create({
    ...dto,
    creator, // Assign full user entity, not just ID
  });

  const saved = await this.attachmentRepo.save(attachment);

  // ✅ Fetch with relations
  const full = await this.attachmentRepo.findOne({
    where: { id: saved.id },
    relations: ['location', 'creator','work_order','service_request'], // ensure 'creator' is included
  });

  await this.eventLogRepo.save({
    event_name: 'attechment_craete',
    attechment_id: saved.id,
    status: 'CREATED',
    //user_id: createProductDto.created_by,
    //changed_by: CreateAttachmentDto.created_by,
    changed_at: new Date(),
     location_time: new Date(),
    remark: JSON.parse(JSON.stringify(full)), // Store full product details as remark
  });

  return {
    statusCode: 201,
    message: 'Attachment uploaded successfully',
    data: full,
  };
}
// async create(dto: CreateAttachmentDto): Promise<any> {
//   const requiredFields = ['location_id', 'base64_file'];

//   for (const field of requiredFields) {
//     if (!dto[field]) {
//       return {
//         statusCode: 400,
//         message: `${field} is required`,
//         data: null,
//       };
//     }
//   }
//  const { work_order_id, uploaded_by,created_by } = dto;
//  if (!dto.created_by || typeof dto.created_by !== 'number') {
//       return {
//         statusCode: 400,
//         message: '`created_by` is required and must be a valid numeric user ID.',
//         data: null,
//       };
//     }
//   // ✅ Validate work_order_id
//   if (work_order_id) {
//     const workOrder = await this.workOrderRepo.findOne({ where: { id: work_order_id } });
//     if (!workOrder) {
//       return {
//         statusCode: 400,
//         message: `Invalid work_order_id: ${work_order_id}`,
//         data: null,
//       };
//     }
//   }

//   //   // ✅ Validate uploaded_by
//   if (uploaded_by) {
//     const user = await this.userRepo.findOne({ where: { id: uploaded_by } });
//     if (!user) {
//       return {
//         statusCode: 400,
//         message: `Invalid uploaded_by user ID: ${uploaded_by}`,
//         data: null,
//       };
//     }
//   }
//     if (created_by) {
//     const user = await this.userRepo.findOne({ where: { id: created_by } });
//     if (!user) {
//       return {
//         statusCode: 400,
//         message: `Invalid created_by user ID: ${created_by}`,
//         data: null,
//       };
//     }
//   }
//   // Save to DB
//   const attachment = this.attachmentRepo.create(dto);
//   const saved = await this.attachmentRepo.save(attachment);
// const full = await this.attachmentRepo.findOne({
//   where: { id: saved.id },
//   relations: ['location','creator'],
// });

// return {
//   statusCode: 201,
//   message: 'Attachment uploaded successfully',
//   data: full,
// };
// }

// async createAttachment(dto: CreateAttachmentDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: Attachment | null;
// }> {
//   const { work_order_id, uploaded_by } = dto;

//   // ✅ Validate work_order_id
//   if (work_order_id) {
//     const workOrder = await this.workOrderRepo.findOne({ where: { id: work_order_id } });
//     if (!workOrder) {
//       return {
//         statusCode: 400,
//         message: `Invalid work_order_id: ${work_order_id}`,
//         data: null,
//       };
//     }
//   }

//   // ✅ Validate uploaded_by
//   if (uploaded_by) {
//     const user = await this.userRepo.findOne({ where: { id: uploaded_by } });
//     if (!user) {
//       return {
//         statusCode: 400,
//         message: `Invalid uploaded_by user ID: ${uploaded_by}`,
//         data: null,
//       };
//     }
//   }

//   const attachment = this.attachmentRepo.create(dto);
//   const saved = await this.attachmentRepo.save(attachment);

//   return {
//     statusCode: 201,
//     message: 'Attachment created successfully',
//     data: saved,
//   };
// }
// async updateAttachment(id: number, dto: UpdateAttachmentDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: Attachment | null;
// }> {

//    if (!dto.updated_by || typeof dto.updated_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`dto.updated_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }


//     const updator = await this.userRepo.findOne({ where: { id: dto.updated_by } });
//   if (!updator) {
//     return {
//       statusCode: 400,
//       message: `Invalid updated_by user ID: ${dto.updated_by}`,
//       data: null,
//     };
//   }
//   const existing = await this.attachmentRepo.findOne({ where: { id } });

//   if (!existing) {
//     return {
//       statusCode: 404,
//       message: `Attachment with ID ${id} not found`,
//       data: null,
//     };
//   }
//  const requiredFields = ['location_id', 'base64_file'];

//   for (const field of requiredFields) {
//     if (!dto[field]) {
//       return {
//         statusCode: 400,
//         message: `${field} is required`,
//         data: null,
//       };
//     }
//   }
//   // Optional FK validations
//   if (dto.work_order_id) {
//     const workOrder = await this.workOrderRepo.findOne({ where: { id: dto.work_order_id } });
//     if (!workOrder) {
//       return {
//         statusCode: 400,
//         message: `Invalid work_order_id: ${dto.work_order_id}`,
//         data: null,
//       };
//     }
//   }

//   if (dto.uploaded_by) {
//     const user = await this.userRepo.findOne({ where: { id: dto.uploaded_by } });
//     if (!user) {
//       return {
//         statusCode: 400,
//         message: `Invalid uploaded_by: ${dto.uploaded_by}`,
//         data: null,
//       };
//     }
//   }
//   const updated = this.attachmentRepo.merge(existing, {
//     ...dto,
//     updator,
//     updated_at: new Date(),
//   });
// // ✅ Reload with relations after save
// const full = await this.attachmentRepo.findOne({
//   where: { id },
//   relations: ['location'], // <-- load location relation
// });

// return {
//   statusCode: 200,
//   message: 'Attachment updated successfully',
//   data: full,
// };

// }






async updateAttachment(id: number, dto: UpdateAttachmentDto): Promise<{
  statusCode: number;
  message: string;
  data: Attachment | null;
}> {
  // Validate updated_by
  if (!dto.updated_by || typeof dto.updated_by !== 'number') {
    return {
      statusCode: 400,
      message: '`updated_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

  const updator = await this.userRepo.findOne({ where: { id: dto.updated_by } });
  if (!updator) {
    return {
      statusCode: 400,
      message: `Invalid updated_by user ID: ${dto.updated_by}`,
      data: null,
    };
  }

  const existing = await this.attachmentRepo.findOne({ where: { id } });
  if (!existing) {
    return {
      statusCode: 404,
      message: `Attachment with ID ${id} not found`,
      data: null,
    };
  }

  // Required field validation
  const requiredFields = ['location_id', 'base64_file'];
  for (const field of requiredFields) {
    if (!dto[field]) {
      return {
        statusCode: 400,
        message: `${field} is required`,
        data: null,
      };
    }
  }

  // Optional FK validations
  if (dto.work_order_id) {
    const workOrder = await this.workOrderRepo.findOne({ where: { id: dto.work_order_id } });
    if (!workOrder) {
      return {
        statusCode: 400,
        message: `Invalid work_order_id: ${dto.work_order_id}`,
        data: null,
      };
    }
  }

  if (dto.uploaded_by) {
    const user = await this.userRepo.findOne({ where: { id: dto.uploaded_by } });
    if (!user) {
      return {
        statusCode: 400,
        message: `Invalid uploaded_by: ${dto.uploaded_by}`,
        data: null,
      };
    }
  }

  // Merge updates and add updator and updated_at
  const updated = this.attachmentRepo.merge(existing, {
    ...dto,
    updator,
    updated_at: new Date(),
  });

  await this.attachmentRepo.save(updated);

  // Load with relations
  const full = await this.attachmentRepo.findOne({
    where: { id },
    relations: ['location', 'updator','signatures'], // make sure 'updator' relation is included
  });
  if (full?.signatures?.length) {
    const publicRoot = path.join(process.cwd(), 'public'); // adjust if needed

    full.signatures = full.signatures.map(sig => {
      let base64Image: string | null = null;
      const absolutePath = path.join(publicRoot, sig.signature_path); // assumes paths like "uploads/attachment/..."

      try {
        if (fs.existsSync(absolutePath)) {
          const imageBuffer = fs.readFileSync(absolutePath);
          const ext = path.extname(sig.signature_path).substring(1); // e.g., jpg
          base64Image = `data:image/${ext};base64,${imageBuffer.toString('base64')}`;
        } else {
          console.warn('File not found:', absolutePath);
        }
      } catch (err) {
        console.error('Error reading signature image:', err);
      }

      return {
        ...sig,
        base64_image: base64Image,
      };
    });
  }

    await this.eventLogRepo.save({
    event_name: 'Attechment_Updated',
    attachment_id: updated.id,
    status: 'UPDATED',
    //user_id: createProductDto.created_by,
    //changed_by: CreateAttachmentDto.created_by,
    changed_at: new Date(),
     location_time: new Date(),
    remark: JSON.parse(JSON.stringify(updated)), // Store full product details as remark
  });
  return {
    statusCode: 200,
    message: 'Attachment updated successfully',
    data: full,
  };
}
// async findAllAttachments(): Promise<{
//   statusCode: number;
//   message: string;
//   data: any[];
// }> {
//   const attachments = await this.attachmentRepo.find({
//     relations: ['signatures'],
//     order: { id: 'DESC' },
//   });

//   const publicRoot = path.join(process.cwd(), 'public'); // base public folder

//   const response = attachments.map(att => {
//     const updatedSignatures = att.signatures?.map(sig => {
//       let base64Image: string | null = null;

//       // Absolute file path
//       const filePath = path.join(publicRoot, sig.signature_path); // ✅ Fix here

//       console.log('Trying to read:', filePath);

//       try {
//         if (fs.existsSync(filePath)) {
//           const imageBuffer = fs.readFileSync(filePath);
//           const ext = path.extname(sig.signature_path).substring(1); // jpg, png, etc.
//           base64Image = `data:image/${ext};base64,${imageBuffer.toString('base64')}`;
//         } else {
//           console.warn('File does not exist:', filePath);
//         }
//       } catch (error) {
//         console.error('Error reading image file:', error);
//       }

//       return {
//         ...sig,
//         base64_image: base64Image,
//       };
//     });

//     return {
//       ...att,
//       signatures: updatedSignatures,
//     };
//   });

//   return {
//     statusCode: 200,
//     message: 'Attachments retrieved successfully',
//     data: response,
//   };
// }
async findAllAttachments(): Promise<{
  statusCode: number;
  message: string;
  data: Attachment[];
}> {
  const attachments = await this.attachmentRepo.find({
     relations: ['signatures'],
    order: { id: 'DESC' },

  });

  return {
    statusCode: 200,
    message: 'Attachments retrieved successfully',
    data: attachments,
  };
}
async deleteAttachment(id: number): Promise<{
  statusCode: number;
  message: string;
}> {
  const existing = await this.attachmentRepo.findOne({ where: { id } });

  if (!existing) {
    return {
      statusCode: 404,
      message: `Attachment with ID ${id} not found`,
    };
  }

  await this.attachmentRepo.delete(id);

  return {
    statusCode: 200,
    message: `Attachment with ID ${id} deleted successfully`,
  };
}
// async searchWithPagination(body: {
//   Page: number;
//   PageSize: number;
//   StartDate?: string;
//   EndDate?: string;
//   Search?: string;
//   work_order_id?: number;
// }): Promise<{
//   statusCode: number;
//   message: string;
//   data: {
//     attachments: any[];
//     total: number;
//     page: number;
//     totalPages: number;
//   };
// }> {
//   const { Page, PageSize, StartDate, EndDate, Search,work_order_id } = body;

//   const page = Page || 1;
//   const limit = PageSize || 10;
//   const skip = (page - 1) * limit;

//   const query = this.attachmentRepo
//     .createQueryBuilder('attachment')
//     .orderBy('attachment.id', 'DESC')
//     .leftJoinAndSelect('attachment.work_order', 'work_order')
//     .leftJoinAndSelect('attachment.creator', 'creator')
//     .leftJoinAndSelect('attachment.updator', 'updator')
//      .leftJoinAndSelect('attachment.signatures', 'signatures');


//   if (Search) {
//     const search = `%${Search.toLowerCase()}%`;
//     query.andWhere(
//       `(LOWER(attachment.document_name) LIKE :search OR LOWER(attachment.document_number) LIKE :search OR LOWER(attachment.remarks) LIKE :search OR LOWER(work_order.order_number) LIKE :search)`,
//       { search },
//     );
//   }
//  if (body.work_order_id) {
//     query.andWhere('attachment.work_order_id = :work_order_id', {
//       work_order_id: body.work_order_id,
//     });
//   }
//   if (StartDate && EndDate) {
//     const start = new Date(StartDate);
//     const end = new Date(EndDate);

//     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//       return {
//         statusCode: 400,
//         message: 'Invalid StartDate or EndDate format',
//         data: {
//           attachments: [],
//           total: 0,
//           page,
//           totalPages: 0,
//         },
//       };
//     }

//     query.andWhere('attachment.created_at BETWEEN :start AND :end', {
//       start: start.toISOString(),
//       end: end.toISOString(),
//     });
//   }

//   const [attachments, total] = await query.skip(skip).take(limit).getManyAndCount();

// const enhancedAttachments = attachments.map((attachment) => {
//   let base64: string = '';

//   try {
//     const filePath = path.join(process.cwd(), 'public', ...attachment.file_url.split('/'));

//     if (fs.existsSync(filePath)) {
//       const buffer = fs.readFileSync(filePath);
//       base64 = `data:${attachment.file_type};base64,${buffer.toString('base64')}`;
//     } else {
//       console.warn(` File not found: ${filePath}`);
//     }
//   } catch (error) {
//     console.warn(`⚠️ Error reading file: ${attachment.file_url}`, error.message);
//   }

//   return {
//     ...attachment,
//     base64,
//   };
// });


//   return {
//     statusCode: 200,
//     message: total > 0 ? 'Attachments retrieved successfully' : 'No attachments found',
//     data: {
//       attachments: enhancedAttachments,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// }

// async searchWithPagination(body: {
//   Page: number;
//   PageSize: number;
//   StartDate?: string;
//   EndDate?: string;
//   Search?: string;
// }): Promise<{
//   statusCode: number;
//   message: string;
//   data: {
//     attachments: any[];
//     total: number;
//     page: number;
//     totalPages: number;
//   };
// }> {
//   const { Page, PageSize, StartDate, EndDate, Search } = body;

//   const page = Page || 1;
//   const limit = PageSize || 10;
//   const skip = (page - 1) * limit;

//   const query = this.attachmentRepo
//     .createQueryBuilder('attachment')
//     .orderBy('attachment.id', 'DESC');

//   if (Search) {
//     const search = `%${Search.toLowerCase()}%`;
//     query.andWhere(
//       `(LOWER(attachment.document_name) LIKE :search OR LOWER(attachment.document_number) LIKE :search OR LOWER(attachment.remarks) LIKE :search)`,
//       { search },
//     );
//   }

//   if (StartDate && EndDate) {
//     const start = new Date(StartDate);
//     const end = new Date(EndDate);

//     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//       return {
//         statusCode: 400,
//         message: 'Invalid StartDate or EndDate format',
//         data: {
//           attachments: [],
//           total: 0,
//           page,
//           totalPages: 0,
//         },
//       };
//     }

//     query.andWhere('attachment.created_at BETWEEN :start AND :end', {
//       start: start.toISOString(),
//       end: end.toISOString(),
//     });
//   }

//   const [attachments, total] = await query.skip(skip).take(limit).getManyAndCount();

//   const enhancedAttachments = attachments.map((attachment) => {
//    // let base64 = null;
//     let base64: string | null = null;

//     try {
//       const filePath = path.join(
//         __dirname,
//         '..',
//         '..',
//         attachment.file_url, // assumes file_url is like 'uploads/attachment/abc.png'
//       );
//       if (fs.existsSync(filePath)) {
//         const buffer = fs.readFileSync(filePath);
//         base64 = `data:${attachment.file_type};base64,${buffer.toString('base64')}`;
//       } else {
//         console.warn(`⚠️ File not found: ${filePath}`);
//       }
//     } catch (error) {
//       console.warn(`⚠️ Error reading file: ${attachment.file_url}`, error.message);
//     }

//     return {
//       ...attachment,
//       base64,
//     };
//   });

//   return {
//     statusCode: 200,
//     message: total > 0 ? 'Attachments retrieved successfully' : 'No attachments found',
//     data: {
//       attachments: enhancedAttachments,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// }

// async searchWithPagination(
//   body: {
//     Page: number;
//     PageSize: number;
//     StartDate?: string;
//     EndDate?: string;
//     Search?: string;
//    // location_id?: number;
//   },
// ): Promise<{
//   statusCode: number;
//   message: string;
//   data: {
//     attachments: any[];
//     total: number;
//     page: number;
//     totalPages: number;
//   };
// }> {
//   const { Page, PageSize, StartDate, EndDate, Search,  } = body;

//   const page = Page || 1;
//   const limit = PageSize || 10;
//   const skip = (page - 1) * limit;

//   const query = this.attachmentRepo
//     .createQueryBuilder('attachment')
//   //  query.andWhere('attachment.location_id = :location_id', { location_id })

//     .orderBy('attachment.id', 'DESC');

  
//   if (Search) {
//     const search = `%${Search.toLowerCase()}%`;
//     query.andWhere(
//       `(LOWER(attachment.document_name) LIKE :search OR LOWER(attachment.document_number) LIKE :search OR LOWER(attachment.remarks) LIKE :search)`,
//       { search }
//     );
//   }

//   //  Location filter
//   // if (location_id) {
//   //   query.andWhere('attachment.location_id = :location_id', { location_id });
//   // }

//   //  Date filter
//   if (StartDate && EndDate) {
//     const start = new Date(StartDate);
//     const end = new Date(EndDate);

//     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//       return {
//         statusCode: 400,
//         message: 'Invalid StartDate or EndDate format',
//         data: {
//           attachments: [],
//           total: 0,
//           page,
//           totalPages: 0,
//         },
//       };
//     }

//     query.andWhere('attachment.created_at BETWEEN :start AND :end', {
//       start: start.toISOString(),
//       end: end.toISOString(),
//     });
//   }

//   // 🔢 Execute query
//   const [attachments, total] = await query.skip(skip).take(limit).getManyAndCount();

//   return {
//     statusCode: 200,
//     message: total > 0 ? 'Attachments retrieved successfully' : 'No attachments found',
//     data: {
//       attachments,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// }

// async searchWithPagination(
//   body: {
//     Page: number;
//     PageSize: number;
//     StartDate?: string;
//     EndDate?: string;
//     Search?: string;
//   },
// ): Promise<{
//   statusCode: number;
//   message: string;
//   data: {
//     attachments: any[];
//     total: number;
//     page: number;
//     totalPages: number;
//   };
// }> {
//   const { Page, PageSize, StartDate, EndDate, Search } = body;

//   const page = Page || 1;
//   const limit = PageSize || 10;
//   const skip = (page - 1) * limit;

//   const query = this.attachmentRepo
//     .createQueryBuilder('attachment')
//     .orderBy('attachment.id', 'DESC');

//   if (Search) {
//     const search = `%${Search.toLowerCase()}%`;
//     query.andWhere(
//       `(LOWER(attachment.document_name) LIKE :search OR LOWER(attachment.document_number) LIKE :search OR LOWER(attachment.remarks) LIKE :search)`,
//       { search }
//     );
//   }

//   if (StartDate && EndDate) {
//     const start = new Date(StartDate);
//     const end = new Date(EndDate);

//     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//       return {
//         statusCode: 400,
//         message: 'Invalid StartDate or EndDate format',
//         data: {
//           attachments: [],
//           total: 0,
//           page,
//           totalPages: 0,
//         },
//       };
//     }

//     query.andWhere('attachment.created_at BETWEEN :start AND :end', {
//       start: start.toISOString(),
//       end: end.toISOString(),
//     });
//   }

//   const [attachments, total] = await query.skip(skip).take(limit).getManyAndCount();

//   // 🔁 Convert file_url to base64
//   const attachmentsWithBase64 = await Promise.all(
//     attachments.map(async (attachment) => {
//       const filePath = path.join(__dirname, '..', '..', 'uploads', 'attachment', path.basename(attachment.file_url));
//       let base64: string | null = null;

//       try {
//         const fileBuffer = fs.readFileSync(filePath);
//         base64 = fileBuffer.toString('base64');
//       } catch (err) {
//         console.warn(`⚠️ File not found or unreadable: ${filePath}`);
//       }

//       return {
//         ...attachment,
//         file_base64: base64,
//       };
//     })
//   );

//   return {
//     statusCode: 200,
//     message: total > 0 ? 'Attachments retrieved successfully' : 'No attachments found',
//     data: {
//       attachments: attachmentsWithBase64,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// }
async searchWithPagination(body: {
  Page: number;
  PageSize: number;
  StartDate?: string;
  EndDate?: string;
  Search?: string;
  work_order_id?: number;
}): Promise<{
  statusCode: number;
  message: string;
  data: {
    attachments: any[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
  const { Page, PageSize, StartDate, EndDate, Search, work_order_id } = body;

  const page = Page || 1;
  const limit = PageSize || 10;
  const skip = (page - 1) * limit;

  const query = this.attachmentRepo
    .createQueryBuilder('attachment')
    .orderBy('attachment.id', 'DESC')
    .leftJoinAndSelect('attachment.work_order', 'work_order')
    .leftJoinAndSelect('attachment.creator', 'creator')
    .leftJoinAndSelect('attachment.updator', 'updator')
    .leftJoinAndSelect('attachment.signatures', 'signatures');

  if (Search) {
    const search = `%${Search.toLowerCase()}%`;
    query.andWhere(
      `(LOWER(attachment.document_name) LIKE :search OR LOWER(attachment.document_number) LIKE :search OR LOWER(attachment.remarks) LIKE :search OR LOWER(work_order.order_number) LIKE :search)`,
      { search },
    );
  }

  if (work_order_id) {
    query.andWhere('attachment.work_order_id = :work_order_id', {
      work_order_id,
    });
  }

  if (StartDate && EndDate) {
    const start = new Date(StartDate);
    const end = new Date(EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: {
          attachments: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    query.andWhere('attachment.created_at BETWEEN :start AND :end', {
      start: start.toISOString(),
      end: end.toISOString(),
    });
  }

  const [attachments, total] = await query.skip(skip).take(limit).getManyAndCount();

  const enhancedAttachments = attachments.map((attachment) => {
    let base64 = '';

    try {
      if (attachment.file_url) {
        const filePath = path.join(process.cwd(), 'public', ...attachment.file_url.split('/'));

        if (fs.existsSync(filePath)) {
          const buffer = fs.readFileSync(filePath);
          base64 = `data:${attachment.file_type};base64,${buffer.toString('base64')}`;
        } else {
          console.warn(`Attachment file not found: ${filePath}`);
        }
      }
    } catch (error) {
      console.warn(` Error reading attachment file: ${attachment.file_url}`, error.message);
    }

    const updatedSignatures = (attachment.signatures || []).map(sig => {
      let signatureBase64: string | null = null;

      try {
        const sigPath = path.join(process.cwd(), 'public', ...sig.signature_path.split('/'));

        if (fs.existsSync(sigPath)) {
          const buffer = fs.readFileSync(sigPath);
          const ext = path.extname(sig.signature_path).substring(1); // jpg/png
          signatureBase64 = `data:image/${ext};base64,${buffer.toString('base64')}`;
        } else {
          console.warn(`Signature file not found: ${sigPath}`);
        }
      } catch (error) {
        console.warn(` Error reading signature file: ${sig.signature_path}`, error.message);
      }

      return {
        ...sig,
        base64_image: signatureBase64,
      };
    });

    return {
      ...attachment,
      base64,
      signatures: updatedSignatures,
    };
  });

  return {
    statusCode: 200,
    message: total > 0 ? 'Attachments retrieved successfully' : 'No attachments found',
    data: {
      attachments: enhancedAttachments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
}

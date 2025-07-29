import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerProduct } from './entities/customer-product.entity';
import { Repository } from 'typeorm';
import { CreateCustomerProductDto } from './dto/create-customer-product.dto';
import { Product } from 'src/product/entities/product.entity';
import { WorkOrder } from 'src/work_orders/entities/work-order.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CustomerProductsService {
    constructor(
    @InjectRepository(CustomerProduct)
    private readonly customerProductRepository: Repository<CustomerProduct>,
     @InjectRepository(Product)
  private productRepository: Repository<Product>,

  @InjectRepository(WorkOrder)
  private workOrderRepository: Repository<WorkOrder>,
          @InjectRepository(User)
        private readonly userRepository: Repository<User>,
  ) {}

// async create(
//   dtos: CreateCustomerProductDto[],
// ): Promise<{ statusCode: number; message: string; data?: any[] }> {
//   if (!Array.isArray(dtos) || dtos.length === 0) {
//     return {
//       statusCode: 400,
//       message: 'Input must be a non-empty array of customer products.',
//     };
//   }

//   const seenSerials = new Set<string>();

//   for (const dto of dtos) {
//     if (dto.serial_no) {
//       if (seenSerials.has(dto.serial_no)) {
//         return {
//           statusCode: 409,
//           message: `Duplicate serial number "${dto.serial_no}" found in input.`,
//         };
//       }
//       seenSerials.add(dto.serial_no);

//       const existsSerial = await this.customerProductRepository.findOne({
//         where: { serial_no: dto.serial_no },
//       });
//       if (existsSerial) {
//         return {
//           statusCode: 409,
//           message: `Serial number "${dto.serial_no}" is already in use.`,
//         };
//       }
//     }

//     if (dto.customer_id) {
//       const existsAssignment = await this.customerProductRepository.findOne({
//         where: {
//           customer: { id: dto.customer_id },
//           product: { id: dto.product_id },
//         },
//       });
//       if (existsAssignment) {
//         return {
//           statusCode: 409,
//           message: `Customer ${dto.customer_id} already has product ${dto.product_id} assigned.`,
//         };
//       }
//     }
//   }

//   const entities = dtos.map((dto) =>
//     this.customerProductRepository.create({
//       delivery_date: dto.delivery_date,
//       expiry_date: dto.expiry_date,
//       remarks: dto.remarks,
//       serial_no: dto.serial_no,
//       is_active: dto.is_active ?? true,
//       is_active_date: new Date(),
//       no_of_items: dto.no_of_items,
//       product: { id: dto.product_id },
//       customer: dto.customer_id ? { id: dto.customer_id } : undefined,
//       installed_by: dto.installed_by ? { id: dto.installed_by } : undefined,
//       work_order: dto.work_order_id ? { id: dto.work_order_id } : undefined,
//     }),
//   );

//   try {
//     const saved = await this.customerProductRepository.save(entities);

//     const full = await this.customerProductRepository.find({
//       where: saved.map((e) => ({ id: e.id })),
//       relations: ['product', 'customer', 'installed_by', 'work_order'],
//     });

//     return {
//       statusCode: 201,
//       message: 'Customer products created successfully.',
//       data: full,
//     };
//   } catch (error) {
//     if (error.code === '23505') {
//       return {
//         statusCode: 409,
//         message: 'Duplicate product and serial_no combination exists in DB.',
//       };
//     }

//     return {
//       statusCode: 500,
//       message: 'Something went wrong while saving customer products.',
//     };
//   }
// }
async create(
  dtos: CreateCustomerProductDto[],
): Promise<{ statusCode: number; message: string; data?: any[]| null }> {
  if (!Array.isArray(dtos) || dtos.length === 0) {
    return {
      statusCode: 400,
      message: 'Input must be a non-empty array of customer products.',
    };
  }


  const seenSerials = new Set<string>();

  for (const dto of dtos) {

      if (!dto.created_by || typeof dto.created_by !== 'number') {
    return {
      statusCode: 400,
      message: '`created_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }
  const creator = await this.userRepository.findOne({
    where: { id: dto.created_by },
  });

  if (!creator) {
    return {
      statusCode: 404,
      message: `User with ID ${dto.created_by} (creator) not found.`,
      data: null,
    };
  }

  
    if (dto.serial_no) {
      if (seenSerials.has(dto.serial_no)) {
        return {
          statusCode: 409,
          message: `Duplicate serial number "${dto.serial_no}" found in input.`,
        };
      }
      seenSerials.add(dto.serial_no);

      const existsSerial = await this.customerProductRepository.findOne({
        where: { serial_no: dto.serial_no },
      });
      if (existsSerial) {
        return {
          statusCode: 409,
          message: `Serial number "${dto.serial_no}" is already in use.`,
        };
      }
    }

    const productExists = await this.productRepository.findOne({
      where: { id: dto.product_id },
    });
    if (!productExists) {
      return {
        statusCode: 404,
        message: `Product with ID "${dto.product_id}" does not exist.`,
      };
    }

    if (dto.work_order_id) {
      const workOrderExists = await this.workOrderRepository.findOne({
        where: { id: dto.work_order_id },
      });
      if (!workOrderExists) {
        return {
          statusCode: 404,
          message: `Work Order with ID "${dto.work_order_id}" does not exist.`,
        };
      }
    }

    if (dto.customer_id) {
      const existsAssignment = await this.customerProductRepository.findOne({
        where: {
          customer: { id: dto.customer_id },
          product: { id: dto.product_id },
        },
      });
      if (existsAssignment) {
        return {
          statusCode: 409,
          message: `Customer ${dto.customer_id} already has product ${dto.product_id} assigned.`,
        };
      }
    }
  }

  // ✅ Create new entities
  const entities = dtos.map((dto) =>
    this.customerProductRepository.create({
      delivery_date: dto.delivery_date,
      expiry_date: dto.expiry_date,
      remarks: dto.remarks,      
      serial_no: dto.serial_no,
      is_active: dto.is_active ?? true,
      is_active_date: new Date(),
      no_of_items: dto.no_of_items,
      product: { id: dto.product_id },
      customer: dto.customer_id ? { id: dto.customer_id } : undefined,
      installed_by: dto.installed_by ? { id: dto.installed_by } : undefined,
      work_order: dto.work_order_id ? { id: dto.work_order_id } : undefined,
      location: dto.location_id ? { id: dto.location_id } : undefined, 
      creator: { id: dto.created_by },
    }),
  );

  try {
    const saved = await this.customerProductRepository.save(entities);

    // ✅ Re-fetch with full relations
    const full = await this.customerProductRepository.find({
      where: saved.map((e) => ({ id: e.id })),
      relations: [
        'product',
        'customer',
        'installed_by',
        'work_order',
        'work_order.customer',
        'work_order.branch',
        'location', 
        'creator',
      ],
    });

    return {
      statusCode: 201,
      message: 'Customer products created successfully.',
      data: full,
    };
  } catch (error) {
    if (error.code === '23505') {
      return {
        statusCode: 409,
        message: 'Duplicate product and serial_no combination exists in DB.',
      };
    }

    return {
      statusCode: 500,
      message: 'Something went wrong while saving customer products.',
    };
  }
}
async update(
  id: number,
  dto: CreateCustomerProductDto,
): Promise<{ statusCode: number; message: string; data: CustomerProduct | null }> {
  // Validate updated_by
  if (!dto.updated_by || typeof dto.updated_by !== 'number') {
    return {
      statusCode: 400,
      message: '`updated_by` is required and must be a valid numeric user ID.',
      data: null,
    };
  }

  const updator = await this.userRepository.findOne({
    where: { id: dto.updated_by },
  });

  if (!updator) {
    return {
      statusCode: 404,
      message: `User with ID ${dto.updated_by} not found.`,
      data: null,
    };
  }

  // Fetch the entity
  const customerProduct = await this.customerProductRepository.findOne({
    where: { id },
  });

  if (!customerProduct) {
    return {
      statusCode: 404,
      message: `CustomerProduct with ID ${id} not found.`,
      data: null,
    };
  }

  // Assign updated_by relation manually
  customerProduct.updator = updator;

  // Assign other fields (your logic here)
  Object.assign(customerProduct, dto);

  // Save will auto-update `updated_at`
  const saved = await this.customerProductRepository.save(customerProduct);

  // Fetch with full relations (include `updator`)
  const withRelations = await this.customerProductRepository.findOne({
    where: { id: saved.id },
    relations: ['product', 'customer', 'updator'],
  });

  return {
    statusCode: 200,
    message: `CustomerProduct with ID ${id} updated successfully.`,
    data: withRelations,
  };
}

// async create(
//   dtos: CreateCustomerProductDto[],
// ): Promise<{ statusCode: number; message: string; data?: any[] }> {
//   if (!Array.isArray(dtos) || dtos.length === 0) {
//     return {
//       statusCode: 400,
//       message: 'Input must be a non-empty array of customer products.',
//     };
//   }

//   const seenSerials = new Set<string>();

//   for (const dto of dtos) {
//     // ✅ Check for duplicate serial_no in input array
//     if (dto.serial_no) {
//       if (seenSerials.has(dto.serial_no)) {
//         return {
//           statusCode: 409,
//           message: `Duplicate serial number "${dto.serial_no}" found in input.`,
//         };
//       }
//       seenSerials.add(dto.serial_no);

//       // ✅ Check for duplicate serial_no in DB
//       const existsSerial = await this.customerProductRepository.findOne({
//         where: { serial_no: dto.serial_no },
//       });
//       if (existsSerial) {
//         return {
//           statusCode: 409,
//           message: `Serial number "${dto.serial_no}" is already in use.`,
//         };
//       }
//     }

//     // ✅ Check if product exists
//     const productExists = await this.productRepository.findOne({
//       where: { id: dto.product_id },
//     });
//     if (!productExists) {
//       return {
//         statusCode: 404,
//         message: `Product with ID "${dto.product_id}" does not exist.`,
//       };
//     }

//     // ✅ Check if work order exists (if provided)
//     if (dto.work_order_id) {
//       const workOrderExists = await this.workOrderRepository.findOne({
//         where: { id: dto.work_order_id },
//       });
//       if (!workOrderExists) {
//         return {
//           statusCode: 404,
//           message: `Work Order with ID "${dto.work_order_id}" does not exist.`,
//         };
//       }
//     }

//     // ✅ Check if customer already has this product assigned
//     if (dto.customer_id) {
//       const existsAssignment = await this.customerProductRepository.findOne({
//         where: {
//           customer: { id: dto.customer_id },
//           product: { id: dto.product_id },
//         },
//       });
//       if (existsAssignment) {
//         return {
//           statusCode: 409,
//           message: `Customer ${dto.customer_id} already has product ${dto.product_id} assigned.`,
//         };
//       }
//     }
//   }

//   // ✅ Create entity instances
//   const entities = dtos.map((dto) =>
//     this.customerProductRepository.create({
//       delivery_date: dto.delivery_date,
//       expiry_date: dto.expiry_date,
//       remarks: dto.remarks,
//       serial_no: dto.serial_no,
//       is_active: dto.is_active ?? true,
//       is_active_date: new Date(),
//       no_of_items: dto.no_of_items,
//       product: { id: dto.product_id },
//       customer: dto.customer_id ? { id: dto.customer_id } : undefined,
//       installed_by: dto.installed_by ? { id: dto.installed_by } : undefined,
//       work_order: dto.work_order_id ? { id: dto.work_order_id } : undefined,
//       location: dto.location_id ? { id: dto.location_id } : undefined, 
//     }),
//   );

  
//   try {
//     const saved = await this.customerProductRepository.save(entities);

//     const full = await this.customerProductRepository.find({
//       where: saved.map((e) => ({ id: e.id })),
//       relations: ['product', 'customer', 'installed_by', 'work_order', 'location'],
//     });

//     return {
//       statusCode: 201,
//       message: 'Customer products created successfully.',
//       data: full,
//     };
//   } catch (error) {
//     if (error.code === '23505') {
//       return {
//         statusCode: 409,
//         message: 'Duplicate product and serial_no combination exists in DB.',
//       };
//     }

//     return {
//       statusCode: 500,
//       message: 'Something went wrong while saving customer products.',
//     };
//   }
// }
// async update(id: number, dto: CreateCustomerProductDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: CustomerProduct | null;
// }> {
//   const result = await this.findOne(id); // result has { statusCode, message, data }

//   if (!result.data) {
//     return {
//       statusCode: 404,
//       message: `Customer Product with ID ${id} not found.`,
//       data: null,
//     };
//   }
// if (!dto.updated_by || typeof dto.updated_by !== 'number') {
//     return {
//       statusCode: 400,
//       message: '`updated_by` is required and must be a valid numeric user ID.',
//       data: null,
//     };
//   }
//    const updator = await this.userRepository.findOne({ where: { id: dto.updated_by } });
//   if (!updator) {
//     return {
//       statusCode: 404,
//       message: `User with ID ${dto.updated_by} not found`,
//       data: null,
//     };
//   }

//   const entity = result.data;

//   // ✅ Check if new product_id exists
//   const productExists = await this.productRepository.findOne({
//     where: { id: dto.product_id },
//   });
//   if (!productExists) {
//     return {
//       statusCode: 404,
//       message: `Product with ID "${dto.product_id}" does not exist.`,
//       data: null,
//     };
//   }

//   // ✅ Check if new work_order_id exists if provided
//   if (dto.work_order_id) {
//     const workOrderExists = await this.workOrderRepository.findOne({
//       where: { id: dto.work_order_id },
//     });
//     if (!workOrderExists) {
//       return {
//         statusCode: 404,
//         message: `Work Order with ID "${dto.work_order_id}" does not exist.`,
//         data: null,
//       };
//     }
//   }

//   // ✅ Optional: Check for duplicate serial_no (if changed)
//   if (
//     dto.serial_no &&
//     (dto.serial_no !== entity.serial_no || dto.product_id !== entity.product.id)
//   ) {
//     const conflict = await this.customerProductRepository.findOne({
//       where: {
//         serial_no: dto.serial_no,
//       },
//     });

//     if (conflict && conflict.id !== id) {
//       return {
//         statusCode: 409,
//         message: `Another customer product with serial number "${dto.serial_no}" already exists.`,
//         data: null,
//       };
//     }
//   }

//   // ✅ Update fields including location
//   Object.assign(entity, {
//     delivery_date: dto.delivery_date,
//     expiry_date: dto.expiry_date,
//     remarks: dto.remarks,
//     serial_no: dto.serial_no,
//     is_active: dto.is_active ?? entity.is_active,
//     is_active_date: new Date(),
//     no_of_items: dto.no_of_items,
//     product: { id: dto.product_id },
//     customer: dto.customer_id ? { id: dto.customer_id } : null,
//     installed_by: dto.installed_by ? { id: dto.installed_by } : undefined,
//     work_order: dto.work_order_id ? { id: dto.work_order_id } : undefined,
//     location: dto.location_id ? { id: dto.location_id } : undefined,
//     updator: { id: dto.updated_by }, 
//   });

//   await this.customerProductRepository.save(entity);

//   // ✅ Re-fetch with all relations
//   const updated = await this.customerProductRepository.findOne({
//     where: { id },
//     relations: [
//       'product',
//       'customer',
//       'installed_by',
//       'work_order',
//       'location', // ✅ Include location in the response
//     ],
//   });

//   return {
//     statusCode: 200,
//     message: 'Customer product updated successfully.',
//     data: updated,
//   };
// }


// async create(
//   dtos: CreateCustomerProductDto[],
// ): Promise<{ statusCode: number; message: string; data?: any[] }> {
//   if (!Array.isArray(dtos) || dtos.length === 0) {
//     return {
//       statusCode: 400,
//       message: 'Input must be a non-empty array of customer products.',
//     };
//   }

//   const seenSerials = new Set<string>();

//   for (const dto of dtos) {
//     // ✅ Check for duplicate serial_no in input array
//     if (dto.serial_no) {
//       if (seenSerials.has(dto.serial_no)) {
//         return {
//           statusCode: 409,
//           message: `Duplicate serial number "${dto.serial_no}" found in input.`,
//         };
//       }
//       seenSerials.add(dto.serial_no);

//       // ✅ Check for duplicate serial_no in DB
//       const existsSerial = await this.customerProductRepository.findOne({
//         where: { serial_no: dto.serial_no },
//       });
//       if (existsSerial) {
//         return {
//           statusCode: 409,
//           message: `Serial number "${dto.serial_no}" is already in use.`,
//         };
//       }
//     }

//     // ✅ Check if product exists
//     const productExists = await this.productRepository.findOne({
//       where: { id: dto.product_id },
//     });
//     if (!productExists) {
//       return {
//         statusCode: 404,
//         message: `Product with ID "${dto.product_id}" does not exist.`,
//       };
//     }

//     // ✅ Check if work order exists (if provided)
//     if (dto.work_order_id) {
//       const workOrderExists = await this.workOrderRepository.findOne({
//         where: { id: dto.work_order_id },
//       });
//       if (!workOrderExists) {
//         return {
//           statusCode: 404,
//           message: `Work Order with ID "${dto.work_order_id}" does not exist.`,
//         };
//       }
//     }

//     // ✅ Check if customer already has this product assigned
//     if (dto.customer_id) {
//       const existsAssignment = await this.customerProductRepository.findOne({
//         where: {
//           customer: { id: dto.customer_id },
//           product: { id: dto.product_id },
//         },
//       });
//       if (existsAssignment) {
//         return {
//           statusCode: 409,
//           message: `Customer ${dto.customer_id} already has product ${dto.product_id} assigned.`,
//         };
//       }
//     }
//   }

//   // ✅ Create entity instances
//   const entities = dtos.map((dto) =>
//     this.customerProductRepository.create({
//       delivery_date: dto.delivery_date,
//       expiry_date: dto.expiry_date,
//       remarks: dto.remarks,
//       serial_no: dto.serial_no,
//       is_active: dto.is_active ?? true,
//       is_active_date: new Date(),
//       no_of_items: dto.no_of_items,
//       product: { id: dto.product_id },
//       customer: dto.customer_id ? { id: dto.customer_id } : undefined,
//       installed_by: dto.installed_by ? { id: dto.installed_by } : undefined,
//       work_order: dto.work_order_id ? { id: dto.work_order_id } : undefined,
//     }),
//   );

//   // ✅ Save to DB
//   try {
//     const saved = await this.customerProductRepository.save(entities);

//     const full = await this.customerProductRepository.find({
//       where: saved.map((e) => ({ id: e.id })),
//       relations: ['product', 'customer', 'installed_by', 'work_order'],
//     });

//     return {
//       statusCode: 201,
//       message: 'Customer products created successfully.',
//       data: full,
//     };
//   } catch (error) {
//     if (error.code === '23505') {
//       return {
//         statusCode: 409,
//         message: 'Duplicate product and serial_no combination exists in DB.',
//       };
//     }

//     return {
//       statusCode: 500,
//       message: 'Something went wrong while saving customer products.',
//     };
//   }
// }

// async update(id: number, dto: CreateCustomerProductDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: CustomerProduct | null;
// }> {
//   const result = await this.findOne(id); // result has { statusCode, message, data }

//   if (!result.data) {
//     return {
//       statusCode: 404,
//       message: `Customer Product with ID ${id} not found.`,
//       data: null,
//     };
//   }

//   const entity = result.data;

//   // Check for duplicate serial_no
//   if (
//     dto.serial_no &&
//     (dto.serial_no !== entity.serial_no || dto.product_id !== entity.product.id)
//   ) {
//     const conflict = await this.customerProductRepository.findOne({
//       where: {
//         product: { id: dto.product_id },
//         serial_no: dto.serial_no,
//       },
//       relations: ['product'],
//     });

//     if (conflict && conflict.id !== id) {
//       return {
//         statusCode: 400,
//         message: `Another customer product with serial number "${dto.serial_no}" already exists for product ID ${dto.product_id}.`,
//         data: null,
//       };
//     }
//   }

//   Object.assign(entity, {
//     ...dto,
//     customer: dto.customer_id ? { id: dto.customer_id } : null,
//     product: { id: dto.product_id },
//     installed_by: dto.installed_by ? { id: dto.installed_by } : undefined,
//     work_order: dto.work_order_id ? { id: dto.work_order_id } : undefined,
//   });

//   const updated = await this.customerProductRepository.save(entity);

//   return {
//     statusCode: 200,
//     message: 'Customer product updated successfully.',
//     data: updated,
//   };
// }
// async update(id: number, dto: CreateCustomerProductDto): Promise<{
//   statusCode: number;
//   message: string;
//   data: CustomerProduct | null;
// }> {
//   const result = await this.findOne(id); // result has { statusCode, message, data }

//   if (!result.data) {
//     return {
//       statusCode: 404,
//       message: `Customer Product with ID ${id} not found.`,
//       data: null,
//     };
//   }

//   const entity = result.data;

//   // ✅ Check if new product_id exists
//   const productExists = await this.productRepository.findOne({
//     where: { id: dto.product_id },
//   });
//   if (!productExists) {
//     return {
//       statusCode: 404,
//       message: `Product with ID "${dto.product_id}" does not exist.`,
//       data: null,
//     };
//   }

//   // ✅ Check if new work_order_id exists if provided
//   if (dto.work_order_id) {
//     const workOrderExists = await this.workOrderRepository.findOne({
//       where: { id: dto.work_order_id },
//     });
//     if (!workOrderExists) {
//       return {
//         statusCode: 404,
//         message: `Work Order with ID "${dto.work_order_id}" does not exist.`,
//         data: null,
//       };
//     }
//   }

//   // ✅ Optional: Check for duplicate serial_no (if changed)
//   if (
//     dto.serial_no &&
//     (dto.serial_no !== entity.serial_no || dto.product_id !== entity.product.id)
//   ) {
//     const conflict = await this.customerProductRepository.findOne({
//       where: {
//         serial_no: dto.serial_no,
//       },
//     });

//     if (conflict && conflict.id !== id) {
//       return {
//         statusCode: 409,
//         message: `Another customer product with serial number "${dto.serial_no}" already exists.`,
//         data: null,
//       };
//     }
//   }

//   // ✅ Update fields
//   Object.assign(entity, {
//     delivery_date: dto.delivery_date,
//     expiry_date: dto.expiry_date,
//     remarks: dto.remarks,
//     serial_no: dto.serial_no,
//     is_active: dto.is_active ?? entity.is_active,
//     is_active_date: new Date(),
//     no_of_items: dto.no_of_items,
//     product: { id: dto.product_id },
//     customer: dto.customer_id ? { id: dto.customer_id } : null,
//     installed_by: dto.installed_by ? { id: dto.installed_by } : undefined,
//     work_order: dto.work_order_id ? { id: dto.work_order_id } : undefined,
//   });

//   const updated = await this.customerProductRepository.save(entity);

//   return {
//     statusCode: 200,
//     message: 'Customer product updated successfully.',
//     data: updated,
//   };
// }

  async findAll(page = 1): Promise<{
  statusCode: number;
  message: string;
  data: CustomerProduct[];
  total: number;
  page: number;
}> {
  const take = 10;
  const skip = (page - 1) * take;

  const [data, total] = await this.customerProductRepository.findAndCount({
    take,
    skip,
    order: { id: 'DESC' },
  });

  return {
    statusCode: 200,
    message: total > 0 ? 'Customer products fetched successfully.' : 'No customer products found.',
    data,
    total,
    page,
  };
}
  // async findOne(id: number): Promise<CustomerProduct> {
  //   const entity = await this.customerProductRepository.findOne({
  //     where: { id },
  //     relations: ['customer', 'product', 'installed_by', 'work_order'],
  //   });

  //   if (!entity) {
  //     throw new NotFoundException(`Customer Product with ID ${id} not found`);
  //   }

  //   return entity;
  // }

  // async remove(id: number): Promise<{message :string}> {
  //   const entity = await this.findOne(id);
  //   await this.customerProductRepository.remove(entity);
  //     return { message: 'customer product  deleted successfully' };
  // }
async findOne(id: number): Promise<{
  statusCode: number;
  message: string;
  data: CustomerProduct | null;
}> {
  const entity = await this.customerProductRepository.findOne({
    where: { id },
    relations: ['customer', 'product', 'installed_by', 'work_order'],
  });

  if (!entity) {
    return {
      statusCode: 404,
      message: `Customer Product with ID ${id} not found.`,
      data: null,
    };
  }

  return {
    statusCode: 200,
    message: 'Customer product retrieved successfully.',
    data: entity,
  };
}

async remove(id: number): Promise<{
  statusCode: number;
  message: string;
  data: CustomerProduct | null;
}> {
  const result = await this.findOne(id);

  if (!result.data) {
    return {
      statusCode: 404,
      message: `Customer Product with ID ${id} not found.`,
      data: null,
    };
  }

  await this.customerProductRepository.remove(result.data);

  return {
    statusCode: 200,
    message: 'Customer product deleted successfully.',
    data: result.data,
  };
}

async findByFilters(
  filters: {
    id?: number;
    serial_no?: string;
    product_id?: number;
    customer_id?: number;
    delivery_date?: string;
    expiry_date?: string;
    remarks?: string;
    is_active?: boolean;
    work_order_id?: number;
    installed_by?: number;
    is_active_date?: string;
    no_of_items?: number;
    location_id?: number;
  },
  page = 1,
  limit = 10,
): Promise<{
  statusCode: number;
  message: string;
  data: {
    records: CustomerProduct[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {



  if (!filters.location_id || filters.location_id <= 0) {
    return {
      statusCode: 400,
      message: 'location_id is required and must be a valid number',
      data: {
        records: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }

  const query = this.customerProductRepository.createQueryBuilder('cp')
    .leftJoinAndSelect('cp.customer', 'customer')
    .leftJoinAndSelect('cp.product', 'product')
    .leftJoinAndSelect('cp.installed_by', 'installed_by')
    .leftJoinAndSelect('cp.work_order', 'work_order') 
    .leftJoinAndSelect('cp.location', 'location')
         .leftJoinAndSelect('cp.creator', 'creator')
    .leftJoinAndSelect('cp.updator', 'updator');

    let hasValidFilter = false;

if (filters.id !== undefined) {
  if (typeof filters.id !== 'number' || isNaN(filters.id)) {
    return {
      statusCode: 400,
      message: 'Invalid value for "id" filter',
      data: { records: [], total: 0, page, totalPages: 0 },
    };
  }
  query.andWhere('cp.id = :id', { id: filters.id });
}


  if (filters.location_id !== undefined) {
    query.andWhere('cp.location_id = :location_id', {
      location_id: filters.location_id,
    });
  }


  if (filters.serial_no !== undefined && filters.serial_no.trim() !== '') {
    query.andWhere('LOWER(cp.serial_no) LIKE LOWER(:serial_no)', {
      serial_no: `%${filters.serial_no.trim()}%`,
    });
  }
  if (filters.product_id !== undefined) {
    query.andWhere('cp.product_id = :product_id', { product_id: filters.product_id });
  }
 if (filters.product_id !== undefined) {
    query.andWhere('product.product_id = :product_id', {
      product_id: filters.product_id,
    });
  }
  if (filters.customer_id !== undefined) {
    query.andWhere('cp.customer_id = :customer_id', { customer_id: filters.customer_id });
  }
   if (filters.delivery_date !== undefined) {
    if (filters.delivery_date.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "delivery_date" filter',
        data: { records: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('cp.expiry_date = :expiry_date', {
      delivery_date: filters.delivery_date.trim(),
    });
  }
    if (filters.expiry_date !== undefined) {
    if (filters.expiry_date.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "expiry_date" filter',
        data: { records: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('cp.expiry_date = :expiry_date', {
      expiry_date: filters.expiry_date.trim(),
    });
  }
  if (filters.remarks !== undefined && filters.remarks.trim() !== '') {
    query.andWhere('LOWER(cp.remarks) LIKE LOWER(:remarks)', {
      remarks: `%${filters.remarks.trim()}%`,
    });
  }
  if (filters.is_active !== undefined) {
    query.andWhere('cp.is_active = :is_active', { is_active: filters.is_active });
  }
  if (filters.work_order_id !== undefined) {
    query.andWhere('cp.work_order_id = :work_order_id', { work_order_id: filters.work_order_id });
  }
  if (filters.installed_by !== undefined) {
    query.andWhere('cp.installed_by = :installed_by', { installed_by: filters.installed_by });
  }
  if (filters.is_active_date !== undefined) {
    if (filters.is_active_date.trim() === '') {
      return {
        statusCode: 400,
        message: 'Invalid value for "is_active_date" filter',
        data: { records: [], total: 0, page, totalPages: 0 },
      };
    }
    query.andWhere('cp.is_active_date = :is_active_date', {
      is_active_date: filters.is_active_date.trim(),
    });
  }
   if (filters.no_of_items !== undefined) {
  if (isNaN(Number(filters.no_of_items))) {
    return {
      statusCode: 400,
      message: 'Invalid value for "no_of_items" filter',
      data: { records: [], total: 0, page, totalPages: 0 },
    };
  }

  query.andWhere('cp.no_of_items = :no_of_items', {
    no_of_items: filters.no_of_items,
  });
}

  const [records, total] = await query
    .orderBy('cp.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Filtered customer products retrieved successfully.' : 'No matching records found.',
    data: {
      records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
async searchWithPagination(body: {
  Page: number;
  PageSize: number;
  StartDate?: string;
  EndDate?: string;
  Search?: string;
  work_order_id?: number;
    location_id?: number;
}): Promise<{
  statusCode: number;
  message: string;
  data: {
    records: CustomerProduct[];
    total: number;
    page: number;
    totalPages: number;
  };
}> {
   const { Page, PageSize, StartDate, EndDate, Search, work_order_id,location_id } = body;
  const page = body.Page || 1;
  const limit = body.PageSize || 10;
  const skip = (page - 1) * limit;

   if (!location_id || location_id <= 0) {
    return {
      statusCode: 400,
      message: 'Location_id is required and must be a valid number',
      data: {
        records: [],
        total: 0,
        page,
        totalPages: 0,
      },
    };
  }

  const query = this.customerProductRepository.createQueryBuilder('cp')
    .leftJoinAndSelect('cp.customer', 'customer')
    .leftJoinAndSelect('cp.product', 'product')
    .leftJoinAndSelect('cp.installed_by', 'installed_by')
    .leftJoinAndSelect('cp.work_order', 'work_order') .leftJoinAndSelect('cp.location', 'location')
         .leftJoinAndSelect('cp.creator', 'creator')
    .leftJoinAndSelect('cp.updator', 'updator');

  if (body.Search) {
    const keyword = `%${body.Search.toLowerCase()}%`;
    query.andWhere(
      `(LOWER(product.name) LIKE :keyword OR LOWER(cp.serial_no) LIKE :keyword OR LOWER(customer.name) LIKE :keyword)`,
      { keyword }
    );
  }

    if (location_id) {
    query.andWhere('location.id = :location_id', { location_id: location_id });
  }
  if (body.work_order_id) {
    query.andWhere('cp.work_order_id = :work_order_id', {
      work_order_id: body.work_order_id,
    });
  }

  if (body.StartDate && body.EndDate) {
    const start = new Date(body.StartDate);
    const end = new Date(body.EndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        statusCode: 400,
        message: 'Invalid StartDate or EndDate format',
        data: { records: [], total: 0, page, totalPages: 0 },
      };
    }

    query.andWhere('cp.created_at BETWEEN :start AND :end', {
      start,
      end,
    });
  }

  const [records, total] = await query
    .orderBy('cp.id', 'DESC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    statusCode: 200,
    message: total > 0 ? 'Customer products found successfully.' : 'No records found.',
    data: {
      records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// async searchWithPagination(body: {
//   Page: number;
//   PageSize: number;
//   StartDate?: string;
//   EndDate?: string;
//   Search?: string;
//   work_oder_id?number;
// }): Promise<{
//   statusCode: number;
//   message: string;
//   data: {
//     records: CustomerProduct[];
//     total: number;
//     page: number;
//     totalPages: number;
//   };
// }> {
//   const page = body.Page || 1;
//   const limit = body.PageSize || 10;
//   const skip = (page - 1) * limit;

//   const query = this.customerProductRepository.createQueryBuilder('cp')
//     .leftJoinAndSelect('cp.customer', 'customer')
//     .leftJoinAndSelect('cp.product', 'product')
//     .leftJoinAndSelect('cp.installed_by', 'installed_by')
//     .leftJoinAndSelect('cp.work_order', 'work_order');

//   // Search filter across multiple fields
//   if (body.Search && body.Search.trim() !== '') {
//     const keyword = `%${body.Search.toLowerCase()}%`;
//     query.andWhere(
//       `(LOWER(cp.serial_no) LIKE :keyword OR LOWER(cp.remarks) LIKE :keyword OR LOWER(product.name) LIKE :keyword OR LOWER(customer.name) LIKE :keyword)`,
//       { keyword }
//     );
//   }

//   // Filter by created_at between StartDate and EndDate
//   if (body.StartDate && body.EndDate) {
//     const start = new Date(body.StartDate);
//     const end = new Date(body.EndDate);

//     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//       return {
//         statusCode: 400,
//         message: 'Invalid StartDate or EndDate format',
//         data: {
//           records: [],
//           total: 0,
//           page,
//           totalPages: 0,
//         },
//       };
//     }

//     query.andWhere('cp.created_at BETWEEN :startDate AND :endDate', {
//       startDate: start.toISOString(),
//       endDate: end.toISOString(),
//     });
//   }

//   // Final paginated fetch
//   const [records, total] = await query
//     .orderBy('cp.id', 'DESC')
//     .skip(skip)
//     .take(limit)
//     .getManyAndCount();

//   return {
//     statusCode: 200,
//     message: total > 0 ? 'Customer products found successfully.' : 'No matching records found.',
//     data: {
//       records,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// }
async updateStatus(
  id: number,
): Promise<{ statusCode: number; message: string; data: CustomerProduct | null }> {
  const customerProduct = await this.customerProductRepository.findOne({ where: { id } });

  if (!customerProduct) {
    return {
      statusCode: 404,
      message: `Customer product with ID ${id} not found`,
      data: null,
    };
  }

  customerProduct.is_active = !customerProduct.is_active;


  customerProduct.is_active_date = new Date();

  const updated = await this.customerProductRepository.save(customerProduct);

  return {
    statusCode: 200,
    message: `Customer product is now ${updated.is_active ? 'Active' : 'Inactive'}`,
    data: updated,
  };
}

}

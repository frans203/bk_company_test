import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { IOrderMapper } from './order-mapper.interface';
import { ORDER_MAPPER_KEY } from './order-mapper.decorator';

@Injectable()
export class OrderMapperRegistry implements OnModuleInit {
  private readonly mappers: Map<string, IOrderMapper> = new Map();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) continue;

      const isMapper = Reflect.getMetadata(ORDER_MAPPER_KEY, metatype);
      if (isMapper) {
        const mapper = instance as IOrderMapper;
        this.mappers.set(mapper.platformName, mapper);
      }
    }
  }

  getMapper(platform: string): IOrderMapper {
    const mapper = this.mappers.get(platform);
    if (!mapper) {
      throw new BadRequestException(
        `No mapper registered for platform: "${platform}"`,
      );
    }
    return mapper;
  }
}

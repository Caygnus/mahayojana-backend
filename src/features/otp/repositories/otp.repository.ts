import { Otp } from '../entities/otp.entity';
import { OtpModel, IOtpDocument } from '../models/otp.model';
import { IOtpRepository } from '../interfaces/i-otp.repository';
import { OtpMapper } from '../mappers/otp.mapper';
import { FilterQuery } from 'mongoose';
import { CreateOtpDTO } from '../dtos/create-otp.dto';

export class OtpRepository implements IOtpRepository {
  async findOtpByPhone(phone: string): Promise<Otp | null> {
    const found = await OtpModel.findOne({
      phone,
      // expiresAt: { $gt: new Date() }
    });
    return found ? OtpMapper.toEntity(found) : null;
  }

  async deleteOtp(id: string): Promise<boolean> {
    const result = await OtpModel.findByIdAndDelete(id);
    return !!result;
  }
  async create(data: Partial<Otp>): Promise<Otp> {
    const modelData = OtpMapper.toModel(data);
    const created = await OtpModel.create(modelData);
    return OtpMapper.toEntity(created);
  }

  async createOtp(data: CreateOtpDTO): Promise<Otp> {
    const modelData = OtpMapper.toModel(data);
    const created = await OtpModel.create(modelData);
    return OtpMapper.toEntity(created);
  }

  async findById(id: string): Promise<Otp | null> {
    const found = await OtpModel.findById(id);
    return found ? OtpMapper.toEntity(found) : null;
  }

  async findOne(filter: Partial<Otp>): Promise<Otp | null> {
    const modelFilter = OtpMapper.toModel(filter) as FilterQuery<IOtpDocument>;
    const found = await OtpModel.findOne(modelFilter);
    return found ? OtpMapper.toEntity(found) : null;
  }

  async findMany(filter: Partial<Otp>): Promise<Otp[]> {
    const modelFilter = OtpMapper.toModel(filter) as FilterQuery<IOtpDocument>;
    const found = await OtpModel.find(modelFilter);
    return OtpMapper.toEntities(found);
  }

  async update(id: string, data: Partial<Otp>): Promise<Otp | null> {
    const modelData = OtpMapper.toModel(data);
    const updated = await OtpModel.findByIdAndUpdate(id, modelData, {
      new: true,
    });
    return updated ? OtpMapper.toEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await OtpModel.findByIdAndDelete(id);
    return !!result;
  }

  async exists(filter: Partial<Otp>): Promise<boolean> {
    const modelFilter = OtpMapper.toModel(filter) as FilterQuery<IOtpDocument>;
    const result = await OtpModel.exists(modelFilter);
    return !!result;
  }
}

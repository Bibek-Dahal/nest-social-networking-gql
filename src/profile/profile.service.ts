import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import {
  CreateProfileInput,
  UpdateProfileInput,
} from './dto/inputs/profile-input';
import { finished } from 'stream/promises';
import { join } from 'path';

@Injectable()
export class ProfileService {
  create(updateProfileInput: UpdateProfileInput) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  async update(id: string, updateProfileInput: UpdateProfileInput) {
    if (updateProfileInput.avatar) {
      console.log('=====fileInfo===', updateProfileInput.avatar);
      // const filename = 'abc.png';
      // const path = join(process.cwd(), 'uploads');
      // const result = updateProfileInput.avatar;
      // const readStream = result.createReadStream();
      // const writeStream = createWriteStream(path);
      // readStream.pipe(writeStream);
      // try {
      //   await finished(writeStream);
      //   return filename;
      // } catch (error) {
      //   return '';
      // }

      // const stream = createReadStream();
      // const out = createWriteStream(`filename.png}`);
      // stream.pipe(out);
      // await finished(out);
    }
    return 'ok';
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}

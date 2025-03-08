import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { EmailService } from './email.service'

@Module({
  imports: [EnvModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

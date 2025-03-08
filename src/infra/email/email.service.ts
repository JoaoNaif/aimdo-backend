import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { Transporter } from 'nodemailer'
import { EnvService } from '../env/env.service'

@Injectable()
export class EmailService {
  private transporter: Transporter

  constructor(private envService: EnvService) {
    this.transporter = nodemailer.createTransport({
      host: this.envService.get('EMAIL_HOST'),
      port: this.envService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.envService.get('EMAIL_USER'),
        pass: this.envService.get('EMAIL_PASS'),
      },
    })
  }

  async sendEmail(to: string, token: string) {
    const baseUrl = this.envService.get('BASE_URL')

    const resetUrl = `${baseUrl}/auth/reset-password?email=${to}&token=${token}` // trocar para url do frontend

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Recuperação de Senha</h2>
        <p>Foi solicitada uma troca de senha para sua conta. Se foi você, clique no botão abaixo:</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
             Redefinir Minha Senha
          </a>
        </div>
        <p>Se você não solicitou esta alteração, por favor ignore este email.</p>
        <p>Este link expira em 1 hora.</p>
        <p style="color: #777; font-size: 12px; margin-top: 30px;">Este é um email automático, não responda.</p>
      </div>
    `

    return await this.transporter.sendMail({
      from: this.envService.get('EMAIL_USER'),
      to,
      subject: 'Recuperação de Senha',
      text: `Foi solicitada uma troca de senha. Acesse o link para redefinir: ${resetUrl}`,
      html,
    })
  }
}

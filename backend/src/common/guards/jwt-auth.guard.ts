import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Global JWT auth guard. Apply with @UseGuards(JwtAuthGuard) on
 * any controller or route that requires authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }

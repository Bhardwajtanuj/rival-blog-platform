import { Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
    constructor(private readonly likesService: LikesService) { }

    /** POST /likes/:postId — toggle like on a post (auth required) */
    @Post(':postId')
    @HttpCode(HttpStatus.OK)
    toggle(
        @Param('postId') postId: string,
        @CurrentUser() user: { userId: string },
    ) {
        return this.likesService.toggle(postId, user.userId);
    }
}

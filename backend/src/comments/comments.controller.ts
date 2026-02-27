import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    /** POST /comments/:postId — create a comment (auth required) */
    @Post(':postId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    create(
        @Param('postId') postId: string,
        @CurrentUser() user: { userId: string },
        @Body() dto: CreateCommentDto,
    ) {
        return this.commentsService.create(postId, user.userId, dto);
    }

    /** GET /comments/:postId — list comments for a post (public) */
    @Get(':postId')
    findAll(@Param('postId') postId: string) {
        return this.commentsService.findByPost(postId);
    }
}

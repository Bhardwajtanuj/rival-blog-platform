import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@CurrentUser() user: { userId: string }, @Body() dto: CreatePostDto) {
        return this.postsService.create(user.userId, dto);
    }

    @Get()
    findAll(@CurrentUser() user: { userId: string }) {
        return this.postsService.findAllForUser(user.userId);
    }

    @Get(':id')
    findOne(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
        return this.postsService.findOne(id, user.userId);
    }

    @Patch(':id')
    update(
        @CurrentUser() user: { userId: string },
        @Param('id') id: string,
        @Body() dto: UpdatePostDto,
    ) {
        return this.postsService.update(id, user.userId, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
        return this.postsService.remove(id, user.userId);
    }

    /** Toggles isPublished — call once to publish, again to unpublish */
    @Patch(':id/publish')
    togglePublish(
        @CurrentUser() user: { userId: string },
        @Param('id') id: string,
    ) {
        return this.postsService.togglePublish(id, user.userId);
    }
}

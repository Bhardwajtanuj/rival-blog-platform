import {
    Injectable,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { generateSlug } from '../common/utils/slug.util';

async function uniqueSlug(prisma: PrismaService, base: string): Promise<string> {
    let slug = base;
    let attempt = 0;
    while (true) {
        const existing = await prisma.blog.findUnique({ where: { slug } });
        if (!existing) return slug;
        attempt++;
        slug = `${base}-${attempt}`;
    }
}

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, dto: CreatePostDto) {
        const base = generateSlug(dto.title);
        const slug = await uniqueSlug(this.prisma, base);

        return this.prisma.blog.create({
            data: {
                title: dto.title,
                content: dto.content,
                summary: dto.summary,
                isPublished: dto.isPublished ?? false,
                slug,
                userId,
            },
        });
    }

    async findAllForUser(userId: string) {
        return this.prisma.blog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const post = await this.prisma.blog.findUnique({ where: { id } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.userId !== userId) throw new ForbiddenException();
        return post;
    }

    async update(id: string, userId: string, dto: UpdatePostDto) {
        const post = await this.prisma.blog.findUnique({ where: { id } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.userId !== userId)
            throw new ForbiddenException('Not the post author');

        let slug = post.slug;
        if (dto.title && dto.title !== post.title) {
            const base = generateSlug(dto.title);
            slug = await uniqueSlug(this.prisma, base);
        }

        return this.prisma.blog.update({
            where: { id },
            data: { ...dto, slug },
        });
    }

    async remove(id: string, userId: string) {
        const post = await this.prisma.blog.findUnique({ where: { id } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.userId !== userId)
            throw new ForbiddenException('Not the post author');

        await this.prisma.blog.delete({ where: { id } });
        return { message: 'Post deleted' };
    }

    async togglePublish(id: string, userId: string) {
        const post = await this.prisma.blog.findUnique({ where: { id } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.userId !== userId)
            throw new ForbiddenException('Not the post author');

        return this.prisma.blog.update({
            where: { id },
            data: { isPublished: !post.isPublished },
        });
    }
}

import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('public')
export class PublicController {
    constructor(private readonly prisma: PrismaService) { }

    @Get('feed')
    async feed(
        @Query('page') page = '1',
        @Query('limit') limit = '10',
    ) {
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
        const skip = (pageNum - 1) * limitNum;

        const [posts, total] = await this.prisma.$transaction([
            this.prisma.blog.findMany({
                where: { isPublished: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    summary: true,
                    createdAt: true,
                    updatedAt: true,
                    user: { select: { id: true, email: true } },
                    _count: { select: { likes: true, comments: true } },
                },
            }),
            this.prisma.blog.count({ where: { isPublished: true } }),
        ]);

        return {
            data: posts,
            meta: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        };
    }

    @Get('posts/:slug')
    async findBySlug(@Param('slug') slug: string) {
        const post = await this.prisma.blog.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                summary: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
                user: { select: { id: true, email: true } },
                comments: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: { select: { id: true, email: true } },
                    },
                },
                _count: { select: { likes: true, comments: true } },
            },
        });

        if (!post || !post.isPublished) {
            throw new NotFoundException('Post not found');
        }

        return post;
    }
}

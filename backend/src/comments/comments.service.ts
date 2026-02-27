import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(blogId: string, userId: string, dto: CreateCommentDto) {
        // Ensure blog exists
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) throw new NotFoundException('Post not found');

        return this.prisma.comment.create({
            data: { content: dto.content, blogId, userId },
            select: {
                id: true,
                content: true,
                createdAt: true,
                user: { select: { id: true, email: true } },
            },
        });
    }

    async findByPost(blogId: string) {
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) throw new NotFoundException('Post not found');

        return this.prisma.comment.findMany({
            where: { blogId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                content: true,
                createdAt: true,
                user: { select: { id: true, email: true } },
            },
        });
    }
}

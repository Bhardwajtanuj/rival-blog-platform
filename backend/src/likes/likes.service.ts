import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
    constructor(private readonly prisma: PrismaService) { }

    async toggle(blogId: string, userId: string) {
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) throw new NotFoundException('Post not found');

        const existing = await this.prisma.like.findUnique({
            where: { userId_blogId: { userId, blogId } },
        });

        if (existing) {
            await this.prisma.like.delete({ where: { id: existing.id } });
        } else {
            await this.prisma.like.create({ data: { userId, blogId } });
        }

        const count = await this.prisma.like.count({ where: { blogId } });
        return { liked: !existing, likeCount: count };
    }
}

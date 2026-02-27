import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
    @IsString()
    @IsOptional()
    @MinLength(3)
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    summary?: string;

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}

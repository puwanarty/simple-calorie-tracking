import { IsDate, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetFoodEntriesQuery {
  @IsOptional()
  @IsInt()
  skip?: number;

  @IsOptional()
  @IsInt()
  take?: number;

  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;
}

export class GetFoodEntriesStatsQuery {
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class CreateFoodEntryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  calories: number;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsNotEmpty()
  @IsDateString()
  takenAt: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class UpdateFoodEntryDto extends CreateFoodEntryDto {}

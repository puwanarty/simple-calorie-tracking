import { IsDateString, IsOptional } from 'class-validator';

export class getAdminFoodEntriesStatsQuery {
  @IsOptional()
  @IsDateString()
  date?: string;
}

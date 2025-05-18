export interface DailyDreamRequest {
  dream: string;
  date: string;
  mood: string;
  index: number;
}
export interface DailyDreamResponse {
  message: string;
  dream: any;
}
export interface DailyDreamErrorResponse {
  error: string;
}
export interface DailyDreamResponseGet {
  _id: string;
  userId: string;
  dream: string;
  mood: string;
  date: string;
  index: number;
}

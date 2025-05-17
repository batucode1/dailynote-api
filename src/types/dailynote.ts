export interface DailyNoteRequest {
  content: string;
  date: string;
  mood: string;
  index: number;
}
export interface DailyNoteResponse {
  message: string;
  note: any;
}
export interface DailyErrorResponse {
  error: string;
}

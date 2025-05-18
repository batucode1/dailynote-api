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
export interface DailyNoteResponseGet {
  _id: string;
  userId: string;
  content: string;
  mood: string;
  date: string;
  index: number;
}

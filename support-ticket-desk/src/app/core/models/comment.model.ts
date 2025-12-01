export interface Comment {
  id: string;
  ticketId: string;
  authorUsername: string;
  message: string;
  createdAt: Date;
}

export interface CommentFormData {
  message: string;
}



export interface NewsletterMessageResponse {
  id: number;
  createdAt: string;
  subject: string;
  text: string;
  approved: boolean;
  reviewedAt: string;
  sentAt: string;
  scheduledAt: string;
  reviewer: Reviewer;
}

export interface Reviewer {
  id: number;
  name: string;
  surname: string;
}

export interface CreateNewsletter {
  id: number;
  subject: string;
  text: string;
  createdAt: string;
  approved: boolean;
}

export interface UpdateNewsletterMessagePrompt {
  subject: string;
  text: string;
  scheduledAt?: string;
  approved: boolean;
}

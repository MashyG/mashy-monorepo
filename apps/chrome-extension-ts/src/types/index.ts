export interface MessagePayload {
  type: 'FROM_POPUP' | 'FROM_CONTENT' | 'FROM_BACKGROUND';
  message: string;
}

export interface MessageResponse {
  message: string;
  success?: boolean;
}

export type ResponseType = 'success' | 'warning' | 'error' | 'info';

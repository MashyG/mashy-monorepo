export type MessageType = "FROM_POPUP" | "FROM_CONTENT" | "FROM_BACKGROUND";

export interface MessagePayload {
  type: MessageType;
  message: string;
}

export interface MessageResponse {
  message: string;
  success?: boolean;
}

export type ResponseType = "success" | "warning" | "error" | "info";

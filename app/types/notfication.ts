export type NotificationData = {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  timeout?: number;
  stack?: any;
};

export type NotificationContent = string | NotificationData;

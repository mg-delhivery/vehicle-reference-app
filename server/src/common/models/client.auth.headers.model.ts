export interface ClientHeaders {
  [key: string]: string;
}

export interface ClientAuthHeaders {
  x_coreos_request_id: string;
  x_coreos_tid: string;
  x_coreos_access: string;
}

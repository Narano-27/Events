export interface Artist {
  id: string;
  label: string;
  events?: {
    id: string;
    label: string;
  }[];
}

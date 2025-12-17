

export interface Event {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  artists?: {
    id: string;
    label: string;
  }[];
}

export type TimeTracker = {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTimeTrackerRequest = {
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
};

export type UpdateTimeTrackerRequest = Partial<CreateTimeTrackerRequest>;

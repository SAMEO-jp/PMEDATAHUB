export interface Member {
  initial: string;
  name: string;
  role: string;
  color: string;
}

export interface ScheduleItem {
  date: string;
  event: string;
}

export interface MinuteItem {
  date: string;
  topic: string;
}

export interface TaskItem {
  name: string;
  status: '依頼済' | '納期';
  deadline: string;
}

export interface ReportItem {
  date: string;
  title: string;
}

export interface QuickLinkCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  seeMore?: boolean;
  seeMoreText?: string;
}

export interface TaskStatusLabelProps {
  status: '依頼済' | '納期';
  deadline: string;
} 
import type { ReactNode } from "react";
import type { Movie, Mood } from "@/types/movie";

export interface NavItem {
  href: string;
  label: string;
  icon?: ReactNode;
  external?: boolean;
}

export interface AdBannerProps {
  /** Google AdSense ad unit slot ID */
  adSlot?: string;
  /** Google AdSense publisher client ID (ca-pub-xxxxxxxx) */
  adClient?: string;
  className?: string;
  /** Accessible label for the ad region */
  label?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export interface SectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
  showAvailability?: boolean;
  onAddToList?: (movieId: number) => void;
  className?: string;
}

export interface MoodChipProps {
  mood: Mood;
  selected?: boolean;
  onSelect?: (moodId: string) => void;
  className?: string;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage?: string;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}

export interface LoadingSkeletonProps {
  variant: "card" | "hero" | "list" | "text";
  count?: number;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
  durationMs?: number;
}

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export interface FilterBarProps {
  moods: Mood[];
  selectedMoodIds: string[];
  onMoodToggle: (moodId: string) => void;
  onClear: () => void;
  className?: string;
}

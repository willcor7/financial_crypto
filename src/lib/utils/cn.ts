import { clsx, type ClassValue } from 'clsx';

/**
 * Utilitaire pour combiner des classes CSS conditionnellement
 * Utilise clsx pour une gestion flexible des classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

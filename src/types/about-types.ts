import { ReactNode } from 'react';

export interface TypewriterTextProps {
    /** The text to be displayed with typewriter effect */
    text: string;
    /** Delay before starting the animation in milliseconds */
    delay?: number;
    /** Speed of typing in milliseconds per character */
    speed?: number;
    /** Additional CSS classes */
    className?: string;
    /** Whether the animation should loop infinitely */
    infinite?: boolean;
    /** Duration to pause at the end of typing before starting to delete (when infinite is true) */
    pauseDuration?: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface FadeInTextProps {
    /** The content to be faded in */
    children: ReactNode;
    /** Delay before starting the fade in animation in milliseconds */
    delay?: number;
    /** Direction from which the element fades in */
    direction?: Direction;
    /** Additional CSS classes */
    className?: string;
}

export interface AnimatedCounterProps {
    /** The target number to count up to */
    target: number;
    /** Duration of the counting animation in milliseconds */
    duration?: number;
    /** Delay before starting the animation in milliseconds */
    delay?: number;
}

export interface WaveTextProps {
    /** The text to be animated with wave effect */
    text: string;
    /** Delay before starting the animation in milliseconds */
    delay?: number;
    /** Additional CSS classes */
    className?: string;
}

import { ReactElement } from 'react';

export interface FeatureItem {
    /** Unique identifier for the feature */
    id: number;
    /** Title of the feature */
    title: string;
    /** Description of the feature */
    description: string;
    /** Icon component for the feature */
    icon: ReactElement;
}

export interface StatItem {
    /** The numeric value to display */
    value: number;
    /** The label for the statistic */
    label: string;
    /** Optional icon component */
    icon?: ReactNode;
    /** Optional color class for the icon */
    iconColor?: string;
    /** Optional suffix to add after the number (e.g., '%' or '+') */
    suffix?: string;
}

export interface StatNumberItem {
    /** The numeric value */
    number: number;
    /** The label for the statistic */
    label: string;
    /** Optional suffix to add after the number (e.g., '%' or '+') */
    suffix?: string;
}

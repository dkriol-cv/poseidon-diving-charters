import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-bold tracking-wide ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase transform',
	{
		variants: {
			variant: {
        // Primary Action (Book Now) - Cyan to Yellow/Dark
				default: 
          'bg-brand-cyan text-white hover:bg-brand-yellow hover:text-brand-dark shadow-sm hover:shadow-md border-2 border-transparent',
				
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        
        // Secondary Action (Learn More) - White to Grey/Cyan
        // Standardized from Homepage "Find Out More" style
				outline:
          'bg-white border-2 border-gray-200 text-brand-cyan hover:border-brand-cyan hover:text-brand-cyan hover:bg-brand-light',
        
        // Hero Action (Transparent Background)
        outlineWhite:
          'border-2 border-white text-white bg-transparent hover:bg-white hover:text-brand-dark',
				
        secondary:
          'bg-brand-light text-brand-dark hover:bg-gray-200',
				
        ghost: 'hover:bg-accent hover:text-accent-foreground',
				
        link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-12 px-6 py-3',
				sm: 'h-10 rounded-md px-4',
				lg: 'h-14 rounded-md px-10 text-base',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };
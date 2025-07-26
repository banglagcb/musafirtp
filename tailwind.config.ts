import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
		screens: {
			'xs': '475px',
			'2xl': '1400px'
		}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'folder-open': {
					'0%': {
						opacity: '0',
						transform: 'perspective(1000px) rotateY(15deg) scale(0.9) translateY(20px)'
					},
					'50%': {
						opacity: '0.7',
						transform: 'perspective(1000px) rotateY(5deg) scale(0.95) translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'perspective(1000px) rotateY(0deg) scale(1) translateY(0px)'
					}
				},
				'float-up': {
					'0%': {
						opacity: '0',
						transform: 'translate(-50%, 20px) scale(0.9)'
					},
					'60%': {
						opacity: '0.8',
						transform: 'translate(-50%, -10px) scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'translate(-50%, -50%) scale(1)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'window-appear': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.8) translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1) translateY(0px)'
					}
				},
				'popup-to-fullscreen': {
					'0%': {
						width: '300px',
						height: '200px',
						borderRadius: '1rem'
					},
					'100%': {
						width: '90vw',
						height: '85vh',
						borderRadius: '1.5rem'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px hsl(var(--primary) / 0.3)'
					},
					'50%': {
						boxShadow: '0 0 20px hsl(var(--primary) / 0.6), 0 0 30px hsl(var(--primary) / 0.4)'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'folder-open': 'folder-open 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'float-up': 'float-up 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
				'slide-up': 'slide-up 0.3s ease-out',
				'window-appear': 'window-appear 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
				'popup-to-fullscreen': 'popup-to-fullscreen 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite'
			},
			perspective: {
				'1000': '1000px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

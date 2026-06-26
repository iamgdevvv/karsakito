import { Carousel } from '@mantine/carousel';
import { Button, Container, createTheme } from '@mantine/core';

const theme = createTheme({
	breakpoints: {
		xs: '361px',
		sm: '601px',
		md: '901px',
		lg: '1200px',
		xl: '1600px',
	},
	fontFamily: 'var(--font-sans)',
	headings: {
		fontFamily: 'var(--font-title)',
		fontWeight: '700',
		sizes: {
			h1: {
				fontSize: 'var(--title-h1)',
				lineHeight: '1.1',
			},
			h2: {
				fontSize: 'var(--title-h2)',
				lineHeight: '1.2',
			},
			h3: {
				fontSize: 'var(--title-h3)',
				lineHeight: '1.2',
			},
			h4: {
				fontSize: 'var(--title-h4)',
				lineHeight: '1.2',
			},
			h5: {
				fontSize: 'var(--title-h5)',
				lineHeight: '1.3',
			},
			h6: {
				fontSize: 'var(--title-h6)',
				lineHeight: '1.3',
			},
		},
	},
	defaultRadius: 'md',
	black: '#0a0a0a',
	primaryColor: 'primary',
	colors: {
		primary: [
			'#e5f3ff',
			'#cde2ff',
			'#9ac2ff',
			'#64a0ff',
			'#3884fe',
			'#1d72fe',
			'#0063ff',
			'#0058e4',
			'#004ecd',
			'#0043b5',
		],
	},
	radius: {
		xs: '2px',
		sm: '4px',
		md: '8px',
		lg: '16px',
		xl: '24px',
		'2xl': '32px',
		'3xl': '56px',
		'4xl': '64px',
		full: '99999px',
	},
	components: {
		Container: Container.extend({
			defaultProps: {
				w: '100%',
				size: 'lg',
			},
		}),
		Button: Button.extend({
			defaultProps: {
				fw: 500,
				radius: 'lg',
			},
		}),
		Carousel: Carousel.extend({
			defaultProps: {
				emblaOptions: {
					align: 'start',
				},
				previousControlProps: {
					'aria-label': 'Previous slide',
				},
				nextControlProps: {
					'aria-label': 'Next slide',
				},
			},
		}),
	},
});

export default theme;

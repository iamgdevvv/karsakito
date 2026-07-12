import { Carousel } from '@mantine/carousel';
import {
	Alert,
	Autocomplete,
	Button,
	Container,
	createTheme,
	Input,
	Menu,
	MultiSelect,
	NumberInput,
	PasswordInput,
	Popover,
	Select,
	Textarea,
	TextInput,
	Tooltip,
} from '@mantine/core';

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
			'#edfdfb',
			'#dcf8f6',
			'#b3f2ec',
			'#89ebe3',
			'#6ae6db',
			'#58e2d6',
			'#4de1d4',
			'#3fc8bb',
			'#31b2a6',
			'#0f766e',
		],
	},
	radius: {
		xs: '2px',
		sm: '4px',
		md: '8px',
		lg: '12px',
		xl: '16px',
		'2xl': '20px',
		'3xl': '28px',
		'4xl': '36px',
		full: '99999px',
	},
	components: {
		Container: Container.extend({
			defaultProps: {
				w: '100%',
				size: 'lg',
			},
		}),
		InputWrapper: Input.Wrapper.extend({
			defaultProps: {
				inputWrapperOrder: ['label', 'input', 'description'],
			},
		}),
		Input: Input.extend({
			defaultProps: {
				size: 'md',
			},
		}),
		TextInput: TextInput.extend({
			defaultProps: {
				size: 'md',
				labelProps: {
					fz: 'sm',
					fw: 400,
				},
			},
		}),
		NumberInput: NumberInput.extend({
			defaultProps: {
				size: 'md',
				allowNegative: false,
				labelProps: {
					fz: 'sm',
					fw: 400,
				},
			},
		}),
		PasswordInput: PasswordInput.extend({
			defaultProps: {
				size: 'md',
				labelProps: {
					fz: 'sm',
					fw: 400,
				},
			},
		}),
		Textarea: Textarea.extend({
			defaultProps: {
				size: 'md',
				labelProps: {
					fz: 'sm',
					fw: 400,
				},
			},
		}),
		Autocomplete: Autocomplete.extend({
			defaultProps: {
				size: 'md',
				labelProps: {
					fz: 'sm',
					fw: 400,
				},
				comboboxProps: {
					size: 'sm',
					withinPortal: false,
					keepMounted: true,
				},
			},
		}),
		Select: Select.extend({
			defaultProps: {
				size: 'md',
				labelProps: {
					fz: 'sm',
					fw: 400,
				},
				comboboxProps: {
					size: 'sm',
					withinPortal: false,
					keepMounted: true,
				},
			},
		}),
		MultiSelect: MultiSelect.extend({
			defaultProps: {
				size: 'md',
				labelProps: {
					fz: 'sm',
					fw: 400,
				},
				comboboxProps: {
					size: 'sm',
					withinPortal: false,
					keepMounted: true,
				},
			},
		}),
		Button: Button.extend({
			defaultProps: {
				size: 'lg',
				fz: 'sm',
				fw: 500,
				radius: 'lg',
				loaderProps: {
					size: 'sm',
				},
				classNames: {
					label: 'leading-tight',
				},
			},
		}),
		Tooltip: Tooltip.extend({
			defaultProps: {
				withinPortal: false,
			},
		}),
		Popover: Popover.extend({
			defaultProps: {
				withinPortal: false,
			},
		}),
		Menu: Menu.extend({
			defaultProps: {
				withinPortal: false,
			},
		}),
		Alert: Alert.extend({
			defaultProps: {
				p: 'sm',
				classNames: {
					body: 'gap-0',
				},
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

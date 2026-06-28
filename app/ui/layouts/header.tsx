import { Container, Stack, type StackProps } from '@mantine/core';
import { cn } from '~app-modules/utils';
import { Image } from '~app-ui/components/image';
import { Link } from '~app-ui/components/link';

export default function Header({ className, ...props }: StackProps) {
	return (
		<Stack
			pos="sticky"
			top={0}
			w="100%"
			bg="white"
			py={{
				base: 'lg',
				md: 'xl',
			}}
			{...props}
			component="header"
			data-slot="header"
			className={cn('z-max', className)}
		>
			<Container>
				{/* Logo */}
				<Link
					to="/"
					aria-label="Karsakito Logo"
				>
					<Image
						src="/logo.svg"
						w={64}
						h={26}
						objectFit="contain"
						objectPosition="left"
					/>
				</Link>
			</Container>
		</Stack>
	);
}

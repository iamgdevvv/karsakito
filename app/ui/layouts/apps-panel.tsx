import { Scene } from '@gfazioli/mantine-scene';
import { Container, Flex, Group, Stack, Text, ThemeIcon, type FlexProps } from '@mantine/core';
import { useMemo } from 'react';
import { HiUser } from 'react-icons/hi2';
import { MdSave } from 'react-icons/md';
import { RiPencilAiFill } from 'react-icons/ri';
import { TbAppsFilled } from 'react-icons/tb';
import { useLocation, useNavigation } from 'react-router';
import { cn, findActiveNavigation } from '~app-modules/utils';
import { Link } from '~app-ui/components/link';

const navigations = [
	{
		label: 'Beranda',
		value: '/',
		icon: <TbAppsFilled />,
		disabled: false,
	},
	{
		label: 'Workspace',
		value: '/workspace',
		icon: <RiPencilAiFill />,
		disabled: false,
	},
	{
		label: 'Tersimpan',
		value: '/workspace/saved',
		icon: <MdSave />,
		disabled: true,
	},
	{
		label: 'Profil',
		value: '/dashboard',
		icon: <HiUser />,
		disabled: false,
	},
];

export default function AppPanel({
	children,
	...props
}: { children: React.ReactNode } & FlexProps) {
	const { pathname } = useLocation();
	const navigation = useNavigation();

	const selectedPanel = useMemo(() => {
		return findActiveNavigation(navigations, pathname);
	}, [navigations]);

	return (
		<Flex
			p={{
				sm: 'xl',
			}}
			bg="white"
			{...props}
		>
			<Scene
				lazy
				lazyThreshold={0.1}
			>
				<Scene.Noise
					opacity={0.3}
					grain={0.4}
					seed={100}
					octaves={1}
					tint="gray"
					tintOpacity={0}
				/>
			</Scene>

			<Container
				pos="relative"
				display="flex"
				bg="gray.0"
				bd={{
					sm: '1px solid gray.3',
				}}
				bdrs={{
					sm: 'xl',
				}}
				pb={{
					sm: 'md',
				}}
				pt="md"
				className="z-2 flex-col"
			>
				{children}
				<Group
					gap={0}
					pos="sticky"
					w={{
						base: 'calc(100% + 32px)',
						sm: 'auto',
					}}
					miw={{
						base: 'calc(100% + 32px)',
						sm: 'auto',
					}}
					mx={{
						base: -16,
						sm: 0,
					}}
					bottom={{
						base: 0,
						sm: 16,
					}}
					mt="auto"
					pt="md"
					justify="center"
					className="pointer-events-none z-2"
				>
					<Group
						gap={0}
						w="100%"
						maw={{
							sm: 400,
						}}
						grow
						bdrs={{
							base: '20px 20px 0 0',
							sm: 'full',
						}}
						bg="white"
						justify="space-evenly"
						py={{
							base: 'xs',
							sm: 'sm',
						}}
						px={{
							base: 'sm',
							sm: 'md',
							lg: 'xl',
						}}
						className="cx-shadow-xs pointer-events-auto shadow-gray-300"
					>
						{navigations.map((nav, index) => {
							if (nav.disabled) {
								return (
									<Stack
										key={`${nav.value}-${index}`}
										gap={2}
										align="center"
										ta="center"
									>
										<ThemeIcon
											radius="full"
											variant="transparent"
											color="gray.6"
										>
											{nav.icon}
										</ThemeIcon>
										<Stack
											gap={0}
											align="center"
										>
											<Text
												span
												fz={{
													base: 10,
													lg: 'xs',
												}}
												c="gray"
											>
												{nav.label}
											</Text>
										</Stack>
									</Stack>
								);
							}

							return (
								<Link
									key={`${nav.value}-${index}`}
									to={nav.value}
									display="flex"
									className={cn(
										'flex-col items-center gap-0.5',
										navigation.state === 'loading' && 'animate-pulse',
									)}
								>
									<ThemeIcon
										radius="full"
										variant={
											selectedPanel && selectedPanel.value === nav.value
												? 'filled'
												: 'transparent'
										}
										color={
											selectedPanel && selectedPanel.value === nav.value
												? 'primary'
												: 'dark'
										}
									>
										{nav.icon}
									</ThemeIcon>
									<Text
										span
										fz={{
											base: 10,
											lg: 'xs',
										}}
										c={
											selectedPanel && selectedPanel.value === nav.value
												? 'primary'
												: undefined
										}
										fw={600}
									>
										{nav.label}
									</Text>
								</Link>
							);
						})}
					</Group>
				</Group>
			</Container>
		</Flex>
	);
}

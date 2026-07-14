import {
	ActionIcon,
	Avatar,
	Button,
	Container,
	Flex,
	Group,
	Kbd,
	Menu,
	MenuDivider,
	MenuDropdown,
	MenuItem,
	MenuTarget,
	Stack,
	Text,
	ThemeIcon,
	type ButtonProps,
	type StackProps,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { useMemo } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { LuArrowUpRight, LuLogOut } from 'react-icons/lu';
import { useNavigate, useNavigation } from 'react-router';
import { adminSpotlight, dashboardSpotlight, staffSpotlight } from '~app-modules/spotlight';
import { cn } from '~app-modules/utils';
import { Image } from '~app-ui/components/image';
import { ButtonLink, Link, NavLink } from '~app-ui/components/link';
import type { User } from '~generated/prisma/browser';

function MenuActionUser({
	data,
	...props
}: ButtonProps & {
	data?: User | null;
}) {
	const navigation = useNavigation();

	if (!data) {
		return (
			<ButtonLink
				variant="light"
				to={navigation.location?.pathname || '/'}
				size="sm"
				fz="sm"
				radius="full"
				h="auto"
				pl={{
					base: 2,
					lg: 8,
				}}
				pr={{
					base: 'sm',
					lg: 'md',
				}}
				py={{
					base: 2,
					lg: 8,
				}}
				leftSection={
					<Avatar
						size="sm"
						mr={-6}
					/>
				}
				{...props}
			>
				Tamu
			</ButtonLink>
		);
	}

	return (
		<Menu
			position="bottom-end"
			width={200}
		>
			<MenuTarget>
				<Button
					variant="light"
					size="sm"
					fz="sm"
					radius="full"
					h="auto"
					pl={{
						base: 2,
						lg: 8,
					}}
					pr={{
						base: 'sm',
						lg: 'md',
					}}
					py={{
						base: 2,
						lg: 8,
					}}
					leftSection={
						<Avatar
							size="sm"
							name={data.name}
							mr={-6}
						/>
					}
					{...props}
				>
					{data.name.split(' ')[0]}
				</Button>
			</MenuTarget>
			<MenuDropdown>
				<MenuItem
					component={Link}
					to="/dashboard"
				>
					Dashboard
				</MenuItem>
				<MenuItem
					component={Link}
					to="/dashboard/profile"
				>
					Profile
				</MenuItem>
				<MenuItem
					component={Link}
					to="/dashboard/change-password"
				>
					Change Password
				</MenuItem>
				<MenuDivider />
				<MenuItem
					color="red"
					component={Link}
					to="/logout"
					replace
					leftSection={<LuLogOut size={14} />}
				>
					Logout
				</MenuItem>
			</MenuDropdown>
		</Menu>
	);
}

function MenuActionUserAdmin({
	data,
	...props
}: ButtonProps & {
	data: User;
}) {
	return (
		<Menu
			position="bottom-end"
			width={200}
		>
			<MenuTarget>
				<Button
					variant="light"
					size="sm"
					fz="sm"
					radius="full"
					h="auto"
					pl={{
						base: 2,
						lg: 8,
					}}
					pr={{
						base: 'sm',
						lg: 'md',
					}}
					py={{
						base: 2,
						lg: 8,
					}}
					leftSection={
						<Avatar
							size="sm"
							name={data.name}
							mr={-6}
						/>
					}
					{...props}
				>
					{data.name.split(' ')[0]}
				</Button>
			</MenuTarget>
			<MenuDropdown>
				<MenuItem
					component={Link}
					to="/dashboard"
				>
					Dashboard
				</MenuItem>
				<MenuItem
					component={Link}
					to="/dashboard/profile"
				>
					Profile
				</MenuItem>
				<MenuItem
					component={Link}
					to="/dashboard/change-password"
				>
					Change Password
				</MenuItem>
				<MenuDivider />
				<MenuItem
					color="red"
					component={Link}
					to="/logout"
					replace
					leftSection={<LuLogOut size={14} />}
				>
					Logout
				</MenuItem>
			</MenuDropdown>
		</Menu>
	);
}

export function Header({
	authUser,
	className,
	...props
}: StackProps & {
	authUser?: User | null;
}) {
	return (
		<Stack
			pos="sticky"
			top={0}
			w="100%"
			bg="white"
			py={{
				base: 'xs',
				md: 'sm',
			}}
			{...props}
			component="header"
			data-slot="Header"
			className={cn('z-10', className)}
		>
			<Container>
				<Flex
					align="center"
					justify="space-between"
				>
					{/* Logo */}
					<Link
						to="/"
						aria-label="Karsakito Logo"
					>
						<Image
							src="/logo.svg"
							w={{
								base: 56,
								lg: 64,
							}}
							h="auto"
							objectFit="contain"
							objectPosition="left"
						/>
					</Link>

					{/* Navigation */}
					<Group gap="xl">
						<Group
							gap="lg"
							visibleFrom="lg"
						>
							<NavLink
								to="/tentang"
								className={({ isActive, isPending, isTransitioning }) =>
									cn('hover:underline', {
										'text-primary font-semibold': isActive,
										'text-primary font-semibold animate-pulse':
											isPending || isTransitioning,
									})
								}
							>
								Tentang
							</NavLink>
							<NavLink
								to="/layanan"
								className={({ isActive, isPending, isTransitioning }) =>
									cn('hover:underline', {
										'text-primary font-semibold': isActive,
										'text-primary font-semibold animate-pulse':
											isPending || isTransitioning,
									})
								}
							>
								Layanan
							</NavLink>
							<NavLink
								to="/biaya-layanan"
								className={({ isActive, isPending, isTransitioning }) =>
									cn('hover:underline', {
										'text-primary font-semibold': isActive,
										'text-primary font-semibold animate-pulse':
											isPending || isTransitioning,
									})
								}
							>
								Biaya Layanan
							</NavLink>
							<NavLink
								to="/hubungi"
								className={({ isActive, isPending, isTransitioning }) =>
									cn('hover:underline', {
										'text-primary font-semibold': isActive,
										'text-primary font-semibold animate-pulse':
											isPending || isTransitioning,
									})
								}
							>
								Hubungi
							</NavLink>
							<Group
								gap={4}
								align="flex-start"
							>
								<Text
									span
									className="text-dark-100"
								>
									KarsaLingo
								</Text>
								<Text
									span
									fz={10}
									fw={700}
									c="primary"
								>
									(Soon)
								</Text>
							</Group>
						</Group>
						<Group gap="xs">
							{authUser ? (
								<>
									<ButtonLink
										variant="outline"
										to="/"
										size="sm"
										fz="sm"
										radius="full"
										h="auto"
										px={{
											base: 'sm',
											lg: 'md',
										}}
										py={{
											base: 6,
											lg: 'xs',
										}}
										rightSection={
											<ThemeIcon
												p={0}
												size={20}
												radius={0}
												ml={-6}
												variant="transparent"
											>
												<LuArrowUpRight size={18} />
											</ThemeIcon>
										}
									>
										Mulai
									</ButtonLink>
									<MenuActionUser data={authUser} />
								</>
							) : (
								<>
									<ButtonLink
										variant="outline"
										to="/register"
										size="sm"
										fz="sm"
										radius="full"
										h="auto"
										px={{
											base: 'sm',
											lg: 'md',
										}}
										py={{
											base: 6,
											lg: 'xs',
										}}
									>
										Daftar
									</ButtonLink>
									<ButtonLink
										to="/"
										variant="light"
										size="sm"
										fz="sm"
										radius="full"
										h="auto"
										px={{
											base: 'sm',
											lg: 'md',
										}}
										py={{
											base: 6,
											lg: 'xs',
										}}
									>
										<Text
											visibleFrom="lg"
											span
											inherit
										>
											Mulai Sekarang
										</Text>
										<Group
											hiddenFrom="lg"
											component="span"
											gap={4}
											fz="inherit"
										>
											<Text
												span
												inherit
											>
												Mulai
											</Text>
											<LuArrowUpRight size={18} />
										</Group>
									</ButtonLink>
								</>
							)}
						</Group>
					</Group>
				</Flex>
			</Container>
		</Stack>
	);
}

export function HeaderApps({
	authUser,
	className,
	...props
}: StackProps & {
	authUser?: User | null;
}) {
	return (
		<Stack
			pos="sticky"
			top={0}
			w="100%"
			bg="white"
			py={{
				base: 'xs',
				md: 'sm',
			}}
			{...props}
			component="header"
			data-slot="HeaderApps"
			className={cn('z-10', className)}
		>
			<Container>
				<Flex
					align="center"
					justify="space-between"
				>
					{/* Logo */}
					<Link
						to="/"
						aria-label="Karsakito Logo"
					>
						<Image
							src="/logo.svg"
							w={{
								base: 56,
								lg: 64,
							}}
							h="auto"
							objectFit="contain"
							objectPosition="left"
						/>
					</Link>

					{/* Navigation */}
					<MenuActionUser data={authUser} />
				</Flex>
			</Container>
		</Stack>
	);
}

export function HeaderDashboard({
	authUser,
	className,
	...props
}: StackProps & {
	authUser: User;
}) {
	const navigate = useNavigate();
	useHotkeys([['mod + K', () => spotlight.open()]]);

	return (
		<Stack
			pos="sticky"
			top={0}
			w="100%"
			bg="white"
			py={{
				base: 'xs',
				md: 'sm',
			}}
			{...props}
			component="header"
			data-slot="HeaderDashboard"
			className={cn('z-10', className)}
		>
			<Container>
				<Flex
					align="center"
					justify="space-between"
				>
					{/* Logo */}
					<Link
						to="/"
						aria-label="Karsakito Logo"
					>
						<Image
							src="/logo.svg"
							w={{
								base: 56,
								lg: 64,
							}}
							h="auto"
							objectFit="contain"
							objectPosition="left"
						/>
					</Link>
					{/* Navigation */}
					<Group gap="xs">
						<Button
							visibleFrom="lg"
							onClick={spotlight.open}
							variant="outline"
							color="dark"
							size="sm"
							fz="sm"
							radius="full"
							w={{
								lg: 280,
							}}
							h="auto"
							px="md"
							py={9}
							leftSection={<HiOutlineSearch size={18} />}
							rightSection={<Kbd>⌘+K</Kbd>}
							classNames={{
								label: 'mr-auto leading-tight',
							}}
						>
							Search Actions
						</Button>
						<ActionIcon
							hiddenFrom="lg"
							onClick={spotlight.open}
							variant="outline"
							color="dark"
							radius="full"
						>
							<HiOutlineSearch size={16} />
						</ActionIcon>
						<MenuActionUser data={authUser} />
					</Group>
				</Flex>
			</Container>
			<Spotlight
				actions={dashboardSpotlight.map((action) => ({
					...action,
					onClick: () => navigate(action.id),
				}))}
				nothingFound="Nothing found..."
				highlightQuery
				searchProps={{
					leftSection: <HiOutlineSearch size={20} />,
					placeholder: 'Search...',
				}}
			/>
		</Stack>
	);
}

export function HeaderAdmin({
	authUser,
	className,
	...props
}: StackProps & {
	authUser: User;
}) {
	const navigate = useNavigate();
	useHotkeys([['mod + K', () => spotlight.open()]]);

	const navigationSpotlight = useMemo(() => {
		if (authUser.role === 'ADMIN') {
			return adminSpotlight;
		}

		return staffSpotlight;
	}, [authUser.role]);

	return (
		<Stack
			pos="sticky"
			top={0}
			w="100%"
			bg="white"
			py={{
				base: 'xs',
				md: 'sm',
			}}
			{...props}
			component="header"
			data-slot="HeaderAdmin"
			className={cn('z-10', className)}
		>
			<Container>
				<Flex
					align="center"
					justify="space-between"
				>
					{/* Logo */}
					<Link
						to="/"
						aria-label="Karsakito Logo"
					>
						<Image
							src="/logo.svg"
							w={{
								base: 56,
								lg: 64,
							}}
							h="auto"
							objectFit="contain"
							objectPosition="left"
						/>
					</Link>

					{/* Navigation */}
					<Group gap="xs">
						<Button
							visibleFrom="lg"
							onClick={spotlight.open}
							variant="outline"
							color="dark"
							size="sm"
							fz="sm"
							radius="full"
							w={{
								lg: 280,
							}}
							h="auto"
							px="md"
							py={9}
							leftSection={<HiOutlineSearch size={18} />}
							rightSection={<Kbd>⌘+K</Kbd>}
							classNames={{
								label: 'mr-auto leading-tight',
							}}
						>
							Search Actions
						</Button>
						<ActionIcon
							hiddenFrom="lg"
							onClick={spotlight.open}
							variant="outline"
							color="dark"
							radius="full"
						>
							<HiOutlineSearch size={16} />
						</ActionIcon>
						<MenuActionUserAdmin data={authUser} />
					</Group>
				</Flex>
			</Container>
			<Spotlight
				actions={navigationSpotlight.map((action) => ({
					...action,
					onClick: () => navigate(action.id),
				}))}
				nothingFound="Nothing found..."
				highlightQuery
				searchProps={{
					leftSection: <HiOutlineSearch size={20} />,
					placeholder: 'Search...',
				}}
			/>
		</Stack>
	);
}

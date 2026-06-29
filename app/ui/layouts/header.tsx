import {
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
	type StackProps,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { HiOutlineSearch } from 'react-icons/hi';
import { LuLogOut } from 'react-icons/lu';
import { NavLink, useNavigate } from 'react-router';
import { adminSpotlight, dashboardSpotlight } from '~app-modules/spotlight';
import { cn } from '~app-modules/utils';
import { Image } from '~app-ui/components/image';
import { ButtonLink, Link } from '~app-ui/components/link';
import type { User } from '~generated/prisma/client';

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
			py="lg"
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
							w={64}
							h={26}
							objectFit="contain"
							objectPosition="left"
						/>
					</Link>

					{/* Navigation */}
					<Group gap="xl">
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
							to="/biaya-langganan"
							className={({ isActive, isPending, isTransitioning }) =>
								cn('hover:underline', {
									'text-primary font-semibold': isActive,
									'text-primary font-semibold animate-pulse':
										isPending || isTransitioning,
								})
							}
						>
							Info Harga
						</NavLink>
						<Group
							gap={4}
							align="flex-start"
						>
							<Text
								span
								className="text-dark-100"
							>
								Kontribusi
							</Text>
							<Text
								span
								fz={10}
								fw={700}
								c="primary"
							>
								(Segera)
							</Text>
						</Group>
						<Group gap="xs">
							{authUser ? (
								<>
									<ButtonLink
										variant="outline"
										to="/apps"
										size="sm"
										radius="full"
										h="auto"
										py="xs"
									>
										Apps
									</ButtonLink>
									<ButtonLink
										to="/dashboard"
										variant="light"
										size="sm"
										radius="full"
										h="auto"
										pl={8}
										pr={16}
										py={8}
										leftSection={
											<Avatar
												size="sm"
												name={authUser.name}
											/>
										}
									>
										Dashboard
									</ButtonLink>
								</>
							) : (
								<>
									<ButtonLink
										variant="outline"
										to="/register"
										size="sm"
										radius="full"
										h="auto"
										py="xs"
									>
										Daftar
									</ButtonLink>
									<ButtonLink
										to="/login"
										variant="light"
										size="sm"
										radius="full"
										h="auto"
										py="xs"
									>
										Mulai Sekarang
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
	authUser: User;
}) {
	return (
		<Stack
			pos="sticky"
			top={0}
			w="100%"
			bg="white"
			py="lg"
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
							w={64}
							h={26}
							objectFit="contain"
							objectPosition="left"
						/>
					</Link>

					{/* Navigation */}
					<Menu
						position="bottom-end"
						width={200}
						withinPortal={false}
					>
						<MenuTarget>
							<Button
								variant="light"
								size="sm"
								radius="full"
								h="auto"
								pl={8}
								pr={16}
								py={8}
								leftSection={
									<Avatar
										size="sm"
										name={authUser.name}
									/>
								}
							>
								{authUser.name.split(' ')[0]}
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

	if (authUser.role === 'ADMIN') {
		return (
			<HeaderAdmin
				authUser={authUser}
				className={className}
				{...props}
			/>
		);
	}

	return (
		<Stack
			pos="sticky"
			top={0}
			w="100%"
			bg="white"
			py="lg"
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
							w={64}
							h={26}
							objectFit="contain"
							objectPosition="left"
						/>
					</Link>

					{/* Navigation */}
					<Group>
						<Button
							onClick={spotlight.open}
							variant="outline"
							color="dark"
							size="sm"
							fz="sm"
							radius="full"
							w={280}
							h="auto"
							py={12}
							leftSection={<HiOutlineSearch size={18} />}
							rightSection={<Kbd>⌘+K</Kbd>}
							classNames={{
								label: 'mr-auto',
							}}
						>
							Search Actions
						</Button>
						<Menu
							position="bottom-end"
							width={200}
							withinPortal={false}
						>
							<MenuTarget>
								<Button
									variant="light"
									size="sm"
									radius="full"
									h="auto"
									pl={8}
									pr={16}
									py={8}
									leftSection={
										<Avatar
											size="sm"
											name={authUser.name}
										/>
									}
								>
									{authUser.name.split(' ')[0]}
								</Button>
							</MenuTarget>
							<MenuDropdown>
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

	return (
		<Stack
			pos="sticky"
			top={0}
			w="100%"
			bg="white"
			py="lg"
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
							w={64}
							h={26}
							objectFit="contain"
							objectPosition="left"
						/>
					</Link>

					{/* Navigation */}
					<Group gap="xs">
						<Button
							onClick={spotlight.open}
							variant="outline"
							color="dark"
							size="sm"
							fz="sm"
							radius="full"
							w={280}
							h="auto"
							py={12}
							leftSection={<HiOutlineSearch size={18} />}
							rightSection={<Kbd>⌘+K</Kbd>}
							classNames={{
								label: 'mr-auto',
							}}
						>
							Search Actions
						</Button>
						<Menu
							position="bottom-end"
							width={200}
							withinPortal={false}
						>
							<MenuTarget>
								<Button
									variant="light"
									size="sm"
									radius="full"
									h="auto"
									pl={8}
									pr={16}
									py={8}
									leftSection={
										<Avatar
											size="sm"
											name={authUser.name}
										/>
									}
								>
									{authUser.name.split(' ')[0]}
								</Button>
							</MenuTarget>
							<MenuDropdown>
								<MenuItem
									component={Link}
									to="/admin"
								>
									Admin Panel
								</MenuItem>
								<MenuItem
									component={Link}
									to="/admin/users"
								>
									Manage Users
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
					</Group>
				</Flex>
			</Container>
			<Spotlight
				actions={adminSpotlight.map((action) => ({
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

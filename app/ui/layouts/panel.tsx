import {
	ActionIcon,
	Box,
	Container,
	Divider,
	Flex,
	Select,
	Stack,
	Transition,
	type FlexProps,
} from '@mantine/core';
import { useMemo, useState, type ReactNode } from 'react';
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpandFilled } from 'react-icons/tb';
import { useLocation, useNavigate, useNavigation } from 'react-router';
import { cn, findActiveNavigation } from '~app-modules/utils';
import { Link, NavLink } from '~app-ui/components/link';
import type { User } from '~generated/prisma/browser';

function Panel({
	children,
	mainNavs,
	secondaryNavs,
	...props
}: FlexProps & {
	children: ReactNode;
	mainNavs?: {
		title: string;
		items: {
			label: string;
			value: string;
		}[];
	};
	secondaryNavs?: {
		title: string;
		items: {
			label: string;
			value: string;
		}[];
	};
}) {
	const { pathname } = useLocation();
	const navigation = useNavigation();
	const navigate = useNavigate();
	const [expandedPanel, setExpandedPanel] = useState(true);

	const sidebarPanel = useMemo(
		() => mainNavs?.items.length || secondaryNavs?.items.length,
		[mainNavs, secondaryNavs],
	);

	const selectedSidebarPanel = useMemo(() => {
		const navigations: {
			label: string;
			value: string;
		}[] = [];

		if (mainNavs) {
			navigations.push(...mainNavs.items);
		}

		if (secondaryNavs) {
			navigations.push(...secondaryNavs.items);
		}

		return findActiveNavigation(navigations, pathname);
	}, [sidebarPanel]);

	return (
		<Flex
			bg="primary.1"
			py="xl"
			{...props}
		>
			<Container>
				<Flex
					h="100%"
					bg="white"
					p={{
						base: 'md',
						md: 'lg',
						lg: 'xl',
					}}
					bdrs="xl"
				>
					{sidebarPanel ? (
						<Transition
							keepMounted
							mounted={expandedPanel}
							exitDelay={0}
							enterDelay={0}
						>
							{(styleTransition) => (
								<Box
									visibleFrom="md"
									w={280}
									miw={280}
									pr="xl"
									style={styleTransition}
								>
									<Stack
										gap={0}
										h="100%"
										pr="lg"
										className="border-r border-gray-200"
									>
										{mainNavs?.items.length
											? mainNavs.items.map((nav, index) => (
													<NavLink
														key={`${nav.value}-${index}`}
														to={nav.value}
														className={({
															isActive,
															isPending,
															isTransitioning,
														}) =>
															cn(
																'text-sm rounded-sm py-2 px-3 hover:text-primary',
																{
																	'text-primary bg-primary-50 font-semibold':
																		isActive ||
																		(selectedSidebarPanel &&
																			selectedSidebarPanel.value ===
																				nav.value),
																	'text-primary bg-primary-50 animate-pulse':
																		isPending ||
																		isTransitioning,
																},
															)
														}
													>
														{nav.label}
													</NavLink>
												))
											: null}

										{sidebarPanel ? <Divider my="lg" /> : null}

										{secondaryNavs?.items?.length
											? secondaryNavs.items.map((nav, index) => {
													if (nav.value === '/logout') {
														return (
															<Link
																key={`${nav.value}-${index}`}
																to={nav.value}
																replace
																py={8}
																px={12}
																bdrs="sm"
																fz="sm"
																className="hover:text-red"
															>
																{nav.label}
															</Link>
														);
													}

													return (
														<NavLink
															key={`${nav.value}-${index}`}
															to={nav.value}
															className={({
																isActive,
																isPending,
																isTransitioning,
															}) =>
																cn(
																	'text-sm rounded-sm py-2 px-3 hover:text-primary',
																	{
																		'text-primary bg-primary-50 font-semibold':
																			isActive ||
																			(selectedSidebarPanel &&
																				selectedSidebarPanel.value ===
																					nav.value),
																		'text-primary bg-primary-50 animate-pulse':
																			isPending ||
																			isTransitioning,
																	},
																)
															}
														>
															{nav.label}
														</NavLink>
													);
												})
											: null}
									</Stack>
								</Box>
							)}
						</Transition>
					) : null}
					<Box w="100%">
						{sidebarPanel ? (
							<Box mb="lg">
								<ActionIcon
									visibleFrom="md"
									variant="subtle"
									size="lg"
									onClick={() => setExpandedPanel(!expandedPanel)}
								>
									{expandedPanel ? (
										<TbLayoutSidebarLeftExpandFilled />
									) : (
										<TbLayoutSidebarLeftCollapseFilled />
									)}
								</ActionIcon>
								<Select
									hiddenFrom="md"
									label="Navigasi"
									placeholder="Pilih menu"
									defaultValue={
										selectedSidebarPanel ? selectedSidebarPanel.value : pathname
									}
									loading={navigation.state === 'loading'}
									radius="xl"
									labelProps={{
										fz: 10,
										fw: 500,
										tt: 'uppercase',
										c: 'primary',
									}}
									classNames={{
										input: 'bg-primary-50',
									}}
									onChange={(href) => {
										if (href) navigate(href);
									}}
									data={[
										...(mainNavs?.items.length
											? [
													{
														group: mainNavs.title,
														items: mainNavs.items,
													},
												]
											: []),
										...(secondaryNavs?.items.length
											? [
													{
														group: secondaryNavs.title,
														items: secondaryNavs.items,
													},
												]
											: []),
									]}
								/>
							</Box>
						) : null}
						{children}
					</Box>
				</Flex>
			</Container>
		</Flex>
	);
}

export function DashboardPanel({
	children,
	...props
}: FlexProps & {
	children: ReactNode;
}) {
	return (
		<Panel
			{...props}
			mainNavs={{
				title: 'Dashboard',
				items: [
					{
						label: 'Ringkasan',
						value: '/dashboard',
					},
					{
						label: 'Penggunaan Token',
						value: '/dashboard/usage',
					},
					{
						label: 'Topup Token',
						value: '/dashboard/topup',
					},
				],
			}}
			secondaryNavs={{
				title: 'Akun',
				items: [
					{
						label: 'Profil',
						value: '/dashboard/profile',
					},
					{
						label: 'Ubah kata sandi',
						value: '/dashboard/change-password',
					},
					{
						label: 'Keluar',
						value: '/logout',
					},
				],
			}}
		>
			{children}
		</Panel>
	);
}

export function AdminPanel({
	authUser,
	children,
	...props
}: FlexProps & {
	authUser: User;
	children: ReactNode;
}) {
	const navigationMain = useMemo(() => {
		const navs = [
			{
				label: 'Ringkasan',
				value: '/admin',
			},
			{
				label: 'Kelola Aplikasi',
				value: '/admin/apps',
			},
		];

		if (authUser.role === 'ADMIN') {
			navs.push({
				label: 'Kelola Pengguna',
				value: '/admin/users',
			});
		}

		return navs;
	}, [authUser.role]);

	return (
		<Panel
			{...props}
			mainNavs={{
				title: 'Admin',
				items: navigationMain,
			}}
			secondaryNavs={{
				title: 'Akun',
				items: [
					{
						label: 'Profil',
						value: '/dashboard/profile',
					},
					{
						label: 'Ubah kata sandi',
						value: '/dashboard/change-password',
					},
					{
						label: 'Keluar',
						value: '/logout',
					},
				],
			}}
		>
			{children}
		</Panel>
	);
}

import { Window, type WindowGroupContextValue } from '@gfazioli/mantine-window';
import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Divider,
	Flex,
	Group,
	LoadingOverlay,
	Modal,
	Popover,
	SegmentedControl,
	Stack,
	Text,
	ThemeIcon,
	Tooltip,
} from '@mantine/core';
import { useFullscreenDocument, useMap, useMediaQuery } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { LuCoins } from 'react-icons/lu';
import { MdOutlineFitScreen, MdSaveAs } from 'react-icons/md';
import { PiCoinsFill } from 'react-icons/pi';
import { VscEmptyWindow } from 'react-icons/vsc';
import { replace, useSearchParams } from 'react-router';
import { labelAppName } from '~app-modules/enum-options';
import { metaPublicRoute } from '~app-modules/meta';
import {
	PayloadWindowWorkspaceSchema,
	type PayloadWindowWorkspace,
	type WorkspaceWindowPlain,
} from '~app-modules/schema/workspace';
import { actionGetKarsaAppsByCategory } from '~app-server/app';
import { actionGetBalanceUser } from '~app-server/balance';
import { authUserCtx } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import { WindowAppKarsaWriter } from '~app-ui/form/window-apps';
import FormWindowWorkspace from '~app-ui/form/window-workspace';
import AppPanel from '~app-ui/layouts/apps-panel';

import type { Route } from './+types/workspace._index';

type WorkspaceViewMode = 'simple' | 'window';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (!user) {
		const redirectParams = new URLSearchParams();
		const queryParams = request.url.split('?')[1];
		let redirectLink = '/workspace';

		if (queryParams) {
			redirectLink += `?${queryParams}`;
		}

		redirectParams.set('redirect', redirectLink);

		throw replace(`/login?${redirectParams.toString()}`);
	}

	context.set(authUserCtx, user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;
	const [optionApps, userBalance] = await Promise.all([
		actionGetKarsaAppsByCategory({ context }),
		actionGetBalanceUser({
			request,
			context,
		}),
	]);

	return {
		user,
		userBalance,
		optionApps,
	};
}

export function meta(_: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Workspace KarsaKito',
		noIndex: true,
	});
}

export default function WorkspaceAppsRoute({ loaderData }: Route.ComponentProps) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [isFirstRender, setIsFirstRender] = useState(false);
	const { fullscreen, toggle: toggleFullscreen } = useFullscreenDocument();
	const [isLoadingRenderWindow, startActionRenderWindow] = useTransition();
	const [openFormNewWindow, setOpenFormNewWindow] = useState(false);
	const [openBalanceUser, setOpenBalanceUser] = useState(false);
	const refCanvas = useRef<HTMLDivElement>(null);
	const groupRef = useRef<WindowGroupContextValue>(null);
	const windowLists = useMap<NonNullable<WorkspaceWindowPlain['id']>, PayloadWindowWorkspace>([]);
	const isMobile = useMediaQuery('(max-width: 1199px)', true, {
		getInitialValueInEffect: true,
	});
	const totalTokenBalance =
		Number(loaderData.userBalance.data?.token || 0) +
		Number(loaderData.userBalance.data?.tokenDaily || 0);

	const viewMode = useMemo(() => {
		const paramViewMode = searchParams.get('viewMode');

		if (paramViewMode === 'window') {
			return 'window';
		}

		return 'simple';
	}, [searchParams]);
	const [pendingViewMode, setPendingViewMode] = useState<WorkspaceViewMode | null>(null);

	const simpleKarsaSelected = useMemo(() => {
		const [first] = windowLists.keys();

		return windowLists.get(first);
	}, [windowLists]);

	const handleFitWindow = useCallback(() => {
		if (groupRef.current) {
			groupRef.current.applyLayout('fill');
			setTimeout(() => {
				if (groupRef.current) {
					if (isMobile) {
						groupRef.current.applyLayout('arrange-rows');
					} else {
						groupRef.current.applyLayout('tile');
					}
				}
			}, 20);
		}
	}, [groupRef.current, isMobile]);

	const handleAddWindow = useCallback(
		(params: PayloadWindowWorkspace) => {
			startActionRenderWindow(() => {
				windowLists.set(params.id, params);

				handleFitWindow();
			});
		},
		[windowLists.size],
	);

	const handleConfirmViewModeChange = useCallback(() => {
		if (!pendingViewMode) {
			return;
		}

		windowLists.clear();
		setOpenFormNewWindow(false);
		setSearchParams({ viewMode: pendingViewMode });
		setPendingViewMode(null);
	}, [pendingViewMode]);

	useEffect(() => {
		if (refCanvas.current && !isFirstRender) {
			const params = Object.fromEntries(searchParams);

			Object.entries(params).forEach(([k, v]) => {
				if (k === 'app') {
					const app = v as PayloadWindowWorkspace['app'];

					const param = PayloadWindowWorkspaceSchema.safeParse({
						id: crypto.randomUUID(),
						title: 'Window Baru',
						app,
					} satisfies PayloadWindowWorkspace);

					if (param.data) {
						startActionRenderWindow(() => {
							handleAddWindow(param.data);
						});
					}
				}
			});

			setIsFirstRender(true);
		}
	}, [isFirstRender, refCanvas.current]);

	return (
		<div className="site">
			<AppPanel className="site-main">
				<Group gap={6}>
					<Popover
						opened={openBalanceUser}
						onChange={setOpenBalanceUser}
						width={200}
						radius="lg"
						position="bottom-start"
						shadow="md"
					>
						<Popover.Target>
							<Badge
								component="button"
								type="button"
								size="xl"
								mih={36}
								px="sm"
								fz="xs"
								fw={500}
								variant="light"
								color="yellow"
								tt="capitalize"
								onMouseEnter={() => setOpenBalanceUser(true)}
								onMouseLeave={() => setOpenBalanceUser(false)}
								aria-expanded={openBalanceUser}
								aria-controls="balance-details"
								leftSection={<PiCoinsFill size={14} />}
								aria-label={`Lihat rincian saldo: ${totalTokenBalance} Token`}
							>
								<Text
									span
									inherit
									fw={700}
								>
									{totalTokenBalance}
								</Text>
							</Badge>
						</Popover.Target>
						<Popover.Dropdown id="balance-details">
							<Stack gap="xs">
								<Flex align="center">
									<ThemeIcon
										w={24}
										h={24}
										variant="light"
										color="yellow"
										radius="full"
										mr={6}
									>
										<PiCoinsFill size={18} />
									</ThemeIcon>
									<Text
										span
										size="sm"
										fw={500}
									>
										{loaderData.userBalance.data?.token || 0} Token
									</Text>
								</Flex>
								<Flex align="center">
									<ThemeIcon
										w={24}
										h={24}
										variant="light"
										color="blue"
										radius="full"
										mr={6}
									>
										<LuCoins size={18} />
									</ThemeIcon>
									<Text
										span
										size="sm"
										fw={500}
									>
										{loaderData.userBalance.data?.tokenDaily || 0} Token Harian
									</Text>
								</Flex>
							</Stack>
						</Popover.Dropdown>
					</Popover>

					<SegmentedControl
						aria-label="Mode Workspace"
						mr="auto"
						withItemsBorders={false}
						classNames={{
							label: 'text-xs min-h-7 flex items-center justify-center',
						}}
						value={viewMode}
						onChange={setPendingViewMode}
						data={[
							{ label: 'Sederhana', value: 'simple' },
							{ label: 'Kreator', value: 'window' },
						]}
					/>

					{viewMode === 'window' ? (
						<>
							<Popover
								opened={openFormNewWindow}
								onChange={setOpenFormNewWindow}
								width={280}
								radius="lg"
								position="bottom-end"
								shadow="md"
							>
								<Popover.Target>
									<Button
										size="sm"
										variant="light"
										leftSection={<VscEmptyWindow size={18} />}
										onClick={() => setOpenFormNewWindow(true)}
									>
										<Text
											span
											inherit
											visibleFrom="sm"
										>
											Tambah Window
										</Text>
										<Text
											span
											inherit
											hiddenFrom="sm"
										>
											Tambah
										</Text>
									</Button>
								</Popover.Target>
								<Popover.Dropdown>
									<FormWindowWorkspace
										optionApps={loaderData.optionApps}
										onSubmit={(value) => {
											handleAddWindow(value);
											setOpenFormNewWindow(false);
										}}
									/>
								</Popover.Dropdown>
							</Popover>
							<Tooltip
								fz="xs"
								label="Penyimpanan Workspace belum tersedia"
							>
								<ActionIcon
									aria-label="Simpan Workspace"
									aria-describedby="workspace-save-status"
									size="lg"
									variant="light"
									disabled
								>
									<MdSaveAs size={20} />
								</ActionIcon>
							</Tooltip>
							<Tooltip
								fz="xs"
								label="Rapikan Window"
							>
								<ActionIcon
									aria-label="Rapikan Window"
									size="lg"
									variant="light"
									onClick={handleFitWindow}
								>
									<MdOutlineFitScreen size={20} />
								</ActionIcon>
							</Tooltip>
						</>
					) : null}

					<Tooltip
						fz="xs"
						label="Layar Penuh"
					>
						<ActionIcon
							aria-label={fullscreen ? 'Keluar dari layar penuh' : 'Buka layar penuh'}
							size="lg"
							variant={fullscreen ? 'filled' : 'light'}
							onClick={toggleFullscreen}
						>
							<BsArrowsFullscreen size={14} />
						</ActionIcon>
					</Tooltip>
				</Group>
				<Divider my="xs" />
				{viewMode === 'window' ? (
					<Text
						id="workspace-save-status"
						size="xs"
						c="dimmed"
						mb="xs"
					>
						Kreator masih eksperimental. Dalam mode ini, Anda dapat mengatur beberapa
						Window untuk mencoba alur kerja. Penyimpanan Workspace belum tersedia.
					</Text>
				) : null}
				<Box
					ref={refCanvas}
					pos="relative"
					bg="gray.1"
					bdrs="xl"
					p="xs"
					mih={windowLists.size * 600}
					flex="1 1 auto"
					className="z-1"
				>
					<LoadingOverlay
						visible={isLoadingRenderWindow}
						zIndex={10}
						overlayProps={{
							radius: 'sm',
							blur: 2,
						}}
					/>
					{refCanvas.current ? (
						viewMode === 'window' ? (
							<Window.Group
								groupRef={groupRef}
								w="100%"
								h="100%"
							>
								{Array.from(windowLists).map(([id, windowItem], index) => (
									<Window
										opened
										key={`${id}-${index}`}
										defaultX={isMobile ? 0 : index * 10}
										defaultY={isMobile ? 0 : index * 10}
										maxWidth="100%"
										maw="100%"
										defaultHeight={600}
										withinPortal={false}
										controlsPosition="right"
										{...windowItem.props}
										id={id}
										title={`${windowItem.title} - ${labelAppName[windowItem.app]}`}
										draggable={isMobile ? 'none' : 'header'}
										resizable={isMobile ? 'none' : undefined}
										withToolsButton={!isMobile}
										onClose={() => {
											startActionRenderWindow(() => {
												windowLists.delete(id);
												handleFitWindow();
											});
										}}
										onPositionChange={({ x, y }) =>
											windowLists.set(id, {
												...windowItem,
												props: {
													x,
													y,
												},
											})
										}
										onSizeChange={({ width, height }) =>
											windowLists.set(id, {
												...windowItem,
												props: {
													width,
													height,
												},
											})
										}
										className="[&_.mantine-ScrollArea-content]:h-full"
									>
										<WindowAppKarsaWriter
											data={windowItem}
											mode={viewMode}
											onSubmit={(karsa) => {
												windowLists.set(id, {
													...windowItem,
													karsa,
												});
											}}
										/>
									</Window>
								))}
							</Window.Group>
						) : (
							<Box
								w="100%"
								maw={600}
								mx="auto"
								bg="white"
								bdrs="xl"
								my="sm"
								p={{
									base: 'md',
									sm: 'lg',
									lg: 'xl',
								}}
							>
								<FormWindowWorkspace
									key={simpleKarsaSelected?.id || null}
									viewMode={viewMode}
									defaultValues={simpleKarsaSelected}
									optionApps={loaderData.optionApps}
									mb="lg"
									onSubmit={(value) => {
										if (simpleKarsaSelected) {
											windowLists.set(simpleKarsaSelected.id, {
												...value,
												id: simpleKarsaSelected.id,
											});
										} else {
											handleAddWindow(value);
										}
									}}
								/>
								{simpleKarsaSelected ? (
									<WindowAppKarsaWriter
										data={simpleKarsaSelected}
										mode={viewMode}
										onSubmit={(karsa) => {
											windowLists.set(simpleKarsaSelected.id, {
												...simpleKarsaSelected,
												karsa,
											});
										}}
									/>
								) : null}
							</Box>
						)
					) : null}
				</Box>
			</AppPanel>
			<Modal
				opened={pendingViewMode !== null}
				onClose={() => setPendingViewMode(null)}
				title={
					<Text
						span
						fw={700}
					>
						Beralih ke Mode {pendingViewMode === 'window' ? 'Kreator' : 'Sederhana'}?
					</Text>
				}
				size="sm"
				radius="lg"
				centered={!isMobile}
			>
				<Stack gap="xs">
					<Text size="sm">
						{pendingViewMode === 'window'
							? 'Mode Kreator memungkinkan Anda membuka dan mengatur beberapa Window dalam satu workspace.'
							: 'Mode Sederhana memusatkan workspace pada satu aplikasi dalam tampilan formulir yang ringkas.'}
					</Text>
					<Text
						size="xs"
						c="dimmed"
						fw={500}
					>
						Seluruh field dan hasil AI dari mode sebelumnya akan dihapus. Tindakan ini
						tidak dapat dibatalkan.
					</Text>
					<Group
						mt="md"
						gap="xs"
						justify="flex-end"
					>
						<Button
							size="sm"
							fz="sm"
							radius="md"
							variant="outline"
							color="orange"
							onClick={() => setPendingViewMode(null)}
						>
							Batal
						</Button>
						<Button
							size="sm"
							fz="sm"
							radius="md"
							variant="light"
							onClick={handleConfirmViewModeChange}
						>
							Lanjut Beralih
						</Button>
					</Group>
				</Stack>
			</Modal>
		</div>
	);
}

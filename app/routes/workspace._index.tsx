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

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;
	const [optionApps, userBalance] = await Promise.all([
		actionGetKarsaAppsByCategory({ context }),
		actionGetBalanceUser({
			userId: user.id,
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
		title: 'Apps KarsaKito',
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
	const [canvasHeight, setCanvasHeight] = useState<number | undefined>(800);
	const windowLists = useMap<NonNullable<WorkspaceWindowPlain['id']>, PayloadWindowWorkspace>([]);
	const isMobile = useMediaQuery('(max-width: 1199px)', true, {
		getInitialValueInEffect: true,
	});

	const viewMode = useMemo(() => {
		const paramViewMode = searchParams.get('viewMode');

		if (paramViewMode === 'window') {
			return 'window';
		}

		return 'simple';
	}, [searchParams]);

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

				setCanvasHeight(Math.ceil(windowLists.size / 2) * 2 * 420);

				handleFitWindow();
			});
		},
		[windowLists.size],
	);

	useEffect(() => {
		if (refCanvas.current && !isFirstRender) {
			const params = Object.fromEntries(searchParams);

			Object.entries(params).forEach(([k, v]) => {
				if (k === 'app') {
					const app = v as PayloadWindowWorkspace['app'];

					const param = PayloadWindowWorkspaceSchema.safeParse({
						id: crypto.randomUUID(),
						title: `Workspace ${labelAppName[app]}`,
						app,
					} satisfies PayloadWindowWorkspace);

					if (param.data) {
						startActionRenderWindow(() => {
							handleAddWindow(param.data);
						});

						setIsFirstRender(true);
					}
				}
			});
		}
	}, [isFirstRender, refCanvas.current]);

	return (
		<div className="site">
			<AppPanel className="site-main">
				<Group gap={6}>
					<Popover
						opened={openBalanceUser}
						width={200}
						radius="lg"
						position="bottom-start"
						shadow="md"
					>
						<Popover.Target>
							<Badge
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
							>
								🪙{' '}
								<Text
									span
									inherit
									fw={700}
								>
									{Number(loaderData.userBalance.data?.token || 0) +
										Number(loaderData.userBalance.data?.tokenDaily || 0)}
								</Text>
							</Badge>
						</Popover.Target>
						<Popover.Dropdown>
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
										{loaderData.userBalance.data?.tokenDaily || 0} Token Daily
									</Text>
								</Flex>
							</Stack>
						</Popover.Dropdown>
					</Popover>

					<SegmentedControl
						mr="auto"
						withItemsBorders={false}
						classNames={{
							label: 'text-xs min-h-7 flex items-center justify-center',
						}}
						value={viewMode}
						onChange={(value) => {
							setSearchParams({ viewMode: value });
						}}
						data={[
							{ label: 'Simple', value: 'simple' },
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
											Add Window
										</Text>
										<Text
											span
											inherit
											hiddenFrom="sm"
										>
											Add new
										</Text>
									</Button>
									{/* <Button
								size="sm"
								variant="light"
								mr="auto"
								pl="xs"
								pr="sm"
								onClick={() => setOpenFormNewWindow(true)}
							>
								<ThemeIcon variant="transparent">
									<VscEmptyWindow size={18} />
								</ThemeIcon>
								<Text
									span
									inherit
									display="inline-block"
									ml={4}
									visibleFrom="sm"
								>
									Add Window
								</Text>
							</Button> */}
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
								label="Save Workspace"
							>
								<ActionIcon
									size="lg"
									variant="light"
								>
									<MdSaveAs size={20} />
								</ActionIcon>
							</Tooltip>
							<Tooltip
								fz="xs"
								label="Fit Window"
							>
								<ActionIcon
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
						label="Fullscreen"
					>
						<ActionIcon
							size="lg"
							variant={fullscreen ? 'filled' : 'light'}
						>
							<BsArrowsFullscreen
								size={14}
								onClick={toggleFullscreen}
							/>
						</ActionIcon>
					</Tooltip>
				</Group>
				<Divider my="xs" />
				<Box
					ref={refCanvas}
					pos="relative"
					bg="gray.1"
					bdrs="xl"
					p="xs"
					mih={canvasHeight}
					flex="1 1 auto"
					className="z-1"
				>
					<LoadingOverlay
						visible={!refCanvas.current || isLoadingRenderWindow}
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
										defaultX={index * 10}
										defaultY={index * 10}
										maxWidth="100%"
										defaultHeight={420}
										withinPortal={false}
										controlsPosition="right"
										{...windowItem.props}
										id={id}
										title={windowItem.title}
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
		</div>
	);
}

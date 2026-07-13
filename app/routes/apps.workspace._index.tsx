import { Window, type WindowGroupContextValue } from '@gfazioli/mantine-window';
import {
	ActionIcon,
	Box,
	Button,
	Divider,
	Group,
	LoadingOverlay,
	Popover,
	Tooltip,
} from '@mantine/core';
import { useFullscreenDocument, useMap, useMediaQuery } from '@mantine/hooks';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { MdOutlineFitScreen, MdSaveAs } from 'react-icons/md';
import { VscEmptyWindow } from 'react-icons/vsc';
import { replace, useSearchParams } from 'react-router';
import { labelAppName } from '~app-modules/enum-options';
import { metaPublicRoute } from '~app-modules/meta';
import {
	PayloadWindowWorkspaceSchema,
	type PayloadWindowWorkspace,
	type WorkspaceWindowPlain,
} from '~app-modules/schema/workspace';
import { slugify } from '~app-modules/utils';
import { actionGetKarsaAppsByCategory } from '~app-server/app';
import { authUserCtx } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import { actionSubmissionKarsaAI } from '~app-server/workspace';
import { WindowAppKarsaWriter } from '~app-ui/form/window-apps';
import FormWindowWorkspace from '~app-ui/form/window-workspace';
import AppPanel from '~app-ui/layouts/apps-panel';

import type { Route } from './+types/apps.workspace._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (!user) {
		const redirectParams = new URLSearchParams();
		const queryParams = request.url.split('?')[1];
		let redirectLink = '/apps/workspace';

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
	const optionApps = await actionGetKarsaAppsByCategory({ context });

	return {
		user,
		optionApps,
	};
}

export async function action({ request, context }: Route.ActionArgs) {
	return await actionSubmissionKarsaAI({
		request,
		context,
	});
}

export function meta(_: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Apps KarsaKito',
		noIndex: true,
	});
}

export default function WorkspaceAppsRoute({ loaderData }: Route.ComponentProps) {
	const [searchParams] = useSearchParams();
	const [isFirstRender, setIsFirstRender] = useState(false);
	const { fullscreen, toggle: toggleFullscreen } = useFullscreenDocument();
	const [isLoadingRenderWindow, startActionRenderWindow] = useTransition();
	const [openFormNewWindow, setOpenFormNewWindow] = useState(false);
	const refCanvas = useRef<HTMLDivElement>(null);
	const groupRef = useRef<WindowGroupContextValue>(null);
	const [canvasHeight, setCanvasHeight] = useState<number | undefined>(800);
	const windowLists = useMap<NonNullable<WorkspaceWindowPlain['id']>, PayloadWindowWorkspace>([]);
	const isMobile = useMediaQuery('(max-width: 1199px)', true, {
		getInitialValueInEffect: true,
	});

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
						title: `Karsa ${labelAppName[app]}`,
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
				<Group
					gap={6}
					justify="flex-end"
				>
					<Popover
						opened={openFormNewWindow}
						onChange={setOpenFormNewWindow}
						width={200}
						position="bottom-start"
						shadow="md"
					>
						<Popover.Target>
							<Button
								size="sm"
								variant="light"
								mr="auto"
								leftSection={<VscEmptyWindow size={18} />}
								onClick={() => setOpenFormNewWindow(true)}
							>
								Add Window
							</Button>
						</Popover.Target>
						<Popover.Dropdown>
							<FormWindowWorkspace
								optionApps={loaderData.optionApps}
								onSubmit={(value) => {
									handleAddWindow({
										...value,
										id: slugify(value.title),
									});
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
					h={canvasHeight}
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
					) : null}
				</Box>
			</AppPanel>
		</div>
	);
}

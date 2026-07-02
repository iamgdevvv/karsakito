import {
	Window,
	type WindowBaseProps,
	type WindowGroupContextValue,
} from '@gfazioli/mantine-window';
import { ActionIcon, Box, Divider, Group, LoadingOverlay, Popover, Tooltip } from '@mantine/core';
import { useFullscreenDocument, useMap, useMediaQuery, useScrollIntoView } from '@mantine/hooks';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { MdOutlineFitScreen, MdSaveAs } from 'react-icons/md';
import { VscEmptyWindow } from 'react-icons/vsc';
import { redirect, useSearchParams } from 'react-router';
import type { Apps } from '~app-modules/enum-options';
import { metaPublicRoute } from '~app-modules/meta';
import { AppSchema } from '~app-modules/schema/workspace';
import { slugify } from '~app-modules/utils';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { WindowAppKarsaWriter } from '~app-ui/form/window-apps';
import FormWindowWorkspace from '~app-ui/form/window-workspace';
import AppPanel from '~app-ui/layouts/apps-panel';

import type { Route } from './+types/apps.workspace._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		request,
	});

	if ('error' in authSession) {
		throw redirect('/login?redirect=/apps/workspace');
	}

	context.set(authUserCtx, authSession.user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;

	return {
		user,
	};
}

export function meta(_: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Apps KarsaKito',
		noIndex: true,
	});
}

export default function WorkspaceAppsRoute() {
	const [searchParams] = useSearchParams();
	const { fullscreen, toggle: toggleFullscreen } = useFullscreenDocument();
	const [isLoadingRenderWindow, startActionRenderWindow] = useTransition();
	const [openFormNewWindow, setOpenFormNewWindow] = useState(false);
	const refCanvas = useRef<HTMLDivElement>(null);
	const groupRef = useRef<WindowGroupContextValue>(null);
	const { scrollIntoView: scrollToBottom, targetRef: targetRefBottom } =
		useScrollIntoView<HTMLDivElement>();
	const [canvasHeight, setCanvasHeight] = useState<number | undefined>(800);
	const windowLists = useMap<
		string,
		WindowBaseProps & {
			app: Apps;
		}
	>([]);
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
		(
			params: Omit<WindowBaseProps, 'id'> & {
				id: string;
				app: Apps;
			},
		) => {
			startActionRenderWindow(() => {
				windowLists.set(params.id, params);

				setCanvasHeight(Math.ceil(windowLists.size / 2) * 2 * 420);

				handleFitWindow();

				if (isMobile) {
					setTimeout(() => {
						scrollToBottom();
					}, 100);
				}
			});
		},
		[isMobile, windowLists.size],
	);

	useEffect(() => {
		if (refCanvas.current) {
			const params = Object.fromEntries(searchParams);

			Object.entries(params).forEach(([k, v]) => {
				if (k === 'app') {
					const value = AppSchema.safeParse(v);

					if (value.data) {
						startActionRenderWindow(() => {
							windowLists.set(value.data, {
								title: value.data,
								app: value.data,
							});

							handleFitWindow();
						});
					}
				}
			});
		}
	}, [searchParams, refCanvas.current]);

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
						position="bottom"
						withArrow
						shadow="md"
					>
						<Popover.Target>
							<Tooltip
								fz="xs"
								label="Add Window"
							>
								<ActionIcon
									size="lg"
									variant="light"
									onClick={() => setOpenFormNewWindow(true)}
								>
									<VscEmptyWindow size={20} />
								</ActionIcon>
							</Tooltip>
						</Popover.Target>
						<Popover.Dropdown>
							<FormWindowWorkspace
								usedTitles={Array.from(windowLists.keys())}
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
									key={id}
									defaultX={index * 10}
									defaultY={index * 10}
									maxWidth="100%"
									defaultHeight={420}
									withinPortal={false}
									controlsPosition="right"
									{...windowItem}
									draggable={isMobile ? 'none' : windowItem.draggable || 'header'}
									resizable={isMobile ? 'none' : windowItem.resizable}
									withToolsButton={isMobile ? false : windowItem.withToolsButton}
									id={id}
									onClose={() => {
										startActionRenderWindow(() => {
											windowLists.delete(id);
											handleFitWindow();
										});
									}}
								>
									<WindowAppKarsaWriter />
								</Window>
							))}
						</Window.Group>
					) : null}
				</Box>
				<div ref={targetRefBottom} />
			</AppPanel>
		</div>
	);
}

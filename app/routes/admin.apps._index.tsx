import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Center,
	Group,
	Indicator,
	Loader,
	Menu,
	MultiSelect,
	Popover,
	Select,
	Stack,
	Table,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { useCallback, useMemo } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FaSort } from 'react-icons/fa';
import { HiOutlineSearch } from 'react-icons/hi';
import { LuTrash } from 'react-icons/lu';
import { redirect, useNavigation, useSearchParams } from 'react-router';
import { optionsAppCategory } from '~app-modules/enum-options';
import { metaAdminRoute } from '~app-modules/meta';
import { PayloadQueryKarsaAppsSchema, type PayloadQueryKarsaApps } from '~app-modules/schema/app';
import { toPayloadSearchParams } from '~app-modules/utils';
import { actionGetKarsaApps } from '~app-server/app';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { ButtonLink, Link } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';
import type { KarsaAppScalarFieldEnum } from '~generated/prisma/internal/prismaNamespace';

import type { Route } from './+types/admin.apps._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		guard: {
			role: ['ADMIN', 'STAFF'],
		},
		request,
	});

	if ('error' in authSession) {
		if (authSession.cause === 'user_not_authorized_role') {
			throw redirect('/');
		}

		throw redirect('/login?redirect=/admin/karsaApps');
	}

	context.set(authUserCtx, authSession.user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;
	const karsaApps = await actionGetKarsaApps({ request, context });

	return {
		user,
		karsaApps,
	};
}

export function meta(_: Route.MetaArgs) {
	return metaAdminRoute({
		title: 'Manage Apps',
	});
}

export default function KarsaAppsAdminRoute({ loaderData }: Route.ComponentProps) {
	const navigation = useNavigation();
	const [searchParams, setSearchParams] = useSearchParams();

	const handlerSearchParams = useCallback(
		(payload: PayloadQueryKarsaApps) => {
			setSearchParams(
				toPayloadSearchParams({
					...loaderData.karsaApps.params,
					...payload,
				}),
			);
		},
		[loaderData.karsaApps.params],
	);

	const handlerResetParams = useCallback(() => {
		setSearchParams({});
	}, []);

	const queryParams = useMemo(
		() =>
			PayloadQueryKarsaAppsSchema.safeParse({
				...loaderData.karsaApps.params,
				...Object.fromEntries(searchParams),
			}).data || {},
		[loaderData.karsaApps.params, searchParams],
	);

	const hasParams = useMemo(() => {
		return Object.values(queryParams).some(Boolean);
	}, [queryParams]);

	const hasParamOrderBy = useMemo(() => {
		if (typeof queryParams?.asc === 'string') {
			return !!queryParams.asc;
		}

		if (typeof queryParams?.desc === 'string') {
			return !!queryParams.desc;
		}

		return queryParams?.asc?.length || queryParams?.desc?.length;
	}, [queryParams]);

	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel
				authUser={loaderData.user}
				className="site-main"
			>
				<Title mb="lg">Manage Apps</Title>
				{navigation.state === 'loading' ? (
					<Center>
						<Loader />
					</Center>
				) : (
					<>
						<Group
							gap="xs"
							component="form"
							mb="md"
							onSubmit={(e) => {
								e.preventDefault();
								const formData = new FormData(e.target);
								const data = Object.fromEntries(formData.entries());

								handlerSearchParams(data);
							}}
						>
							<ButtonLink
								to="/admin/apps/create"
								variant="light"
								size="xs"
								fz="xs"
								radius="md"
							>
								Create New
							</ButtonLink>
							<TextInput
								name="search"
								defaultValue={loaderData.karsaApps.params?.search}
								placeholder="Search..."
								size="xs"
								rightSection={
									<ActionIcon
										type="submit"
										size="sm"
										variant="subtle"
										radius="full"
										className="not-hover:text-dark"
									>
										<HiOutlineSearch />
									</ActionIcon>
								}
							/>
							<Group
								gap="xs"
								ml="auto"
							>
								<Select
									name="category"
									size="xs"
									defaultValue={loaderData.karsaApps.params?.category}
									data={optionsAppCategory}
								/>
								<Popover
									width={160}
									position="bottom"
								>
									<Popover.Target>
										<Indicator
											processing
											size={6}
											disabled={!hasParamOrderBy}
										>
											<ActionIcon
												variant="outline"
												radius="md"
											>
												<FaSort />
											</ActionIcon>
										</Indicator>
									</Popover.Target>
									<Popover.Dropdown>
										<Stack gap="xs">
											<MultiSelect
												name="asc"
												defaultValue={
													typeof loaderData.karsaApps.params?.asc ===
													'string'
														? [loaderData.karsaApps.params.asc]
														: loaderData.karsaApps.params?.asc
												}
												data={
													[
														'name',
														'label',
														'token',
														'tokenPromo',
														'visible',
														'createdAt',
														'updatedAt',
													] satisfies KarsaAppScalarFieldEnum[]
												}
												label="Sort ASC"
												labelProps={{
													fz: 10,
												}}
												size="xs"
											/>
											<MultiSelect
												name="desc"
												defaultValue={
													typeof loaderData.karsaApps.params?.desc ===
													'string'
														? [loaderData.karsaApps.params.desc]
														: loaderData.karsaApps.params?.desc
												}
												data={
													[
														'name',
														'label',
														'token',
														'tokenPromo',
														'visible',
														'createdAt',
														'updatedAt',
													] satisfies KarsaAppScalarFieldEnum[]
												}
												label="Sort DESC"
												labelProps={{
													fz: 10,
												}}
												size="xs"
											/>
										</Stack>
									</Popover.Dropdown>
								</Popover>
								<Group gap={4}>
									<Button
										type="submit"
										size="xs"
										fz="xs"
										variant="light"
									>
										Apply
									</Button>
									{hasParams ? (
										<Button
											type="reset"
											size="xs"
											fz="xs"
											variant="light"
											color="gray.2"
											onClick={handlerResetParams}
										>
											Reset
										</Button>
									) : null}
								</Group>
							</Group>
						</Group>
						<Box
							w="100%"
							className="overflow-auto"
						>
							<Table
								striped
								highlightOnHover
								withTableBorder
							>
								<Table.Thead>
									<Table.Tr>
										<Table.Td miw={160}>Nama</Table.Td>
										<Table.Td miw={160}>Label</Table.Td>
										<Table.Td miw={88}>Category</Table.Td>
										<Table.Td miw={80}>Token</Table.Td>
										<Table.Td miw={80}>Visible</Table.Td>
										<Table.Td ta="center">Action</Table.Td>
									</Table.Tr>
								</Table.Thead>
								{loaderData.karsaApps.data.length ? (
									<Table.Tbody>
										{loaderData.karsaApps.data.map((app, index) => (
											<Table.Tr key={`${app.id}-${index}`}>
												<Table.Td>{app.name}</Table.Td>
												<Table.Td>{app.label}</Table.Td>
												<Table.Td>{app.category}</Table.Td>
												<Table.Td>
													{app.tokenPromo ? (
														<Text
															span
															fz="inherit"
														>
															{app.tokenPromo}
															<Text
																span
																fz="0.6em"
																td="line-through"
																c="gray.6"
															>
																{app.token}
															</Text>
														</Text>
													) : (
														app.token
													)}
												</Table.Td>
												<Table.Td>
													{app.visible ? (
														<Badge
															variant="light"
															color="green"
															tt="none"
															fw={500}
														>
															Visible
														</Badge>
													) : (
														<Badge
															variant="light"
															color="red"
															tt="none"
															fw={500}
														>
															Invisible
														</Badge>
													)}
												</Table.Td>
												<Table.Td ta="center">
													<Menu
														width={160}
														position="bottom-end"
													>
														<Menu.Target>
															<ActionIcon
																variant="outline"
																radius="full"
															>
																<BsThreeDots />
															</ActionIcon>
														</Menu.Target>
														<Menu.Dropdown>
															<Menu.Item
																component={Link}
																to={`/admin/karsaApps/${app.id}`}
															>
																Update
															</Menu.Item>
															<Menu.Item
																component={Link}
																to={`/admin/karsaApps/${app.id}/delete`}
																color="red"
																leftSection={<LuTrash size={14} />}
															>
																Delete
															</Menu.Item>
														</Menu.Dropdown>
													</Menu>
												</Table.Td>
											</Table.Tr>
										))}
									</Table.Tbody>
								) : (
									<Table.Caption>KarsaApps not found</Table.Caption>
								)}
							</Table>
						</Box>
						{loaderData.karsaApps.previousCursor || loaderData.karsaApps.nextCursor ? (
							<Group
								justify="flex-end"
								gap="xs"
								mt="md"
							>
								{loaderData.karsaApps.previousCursor ? (
									<Button
										variant="outline"
										color="dark"
										size="sm"
										fz="sm"
										radius="lg"
										onClick={() =>
											handlerSearchParams({
												previousCursor:
													loaderData.karsaApps.previousCursor!,
												nextCursor: undefined,
											})
										}
									>
										Previous
									</Button>
								) : null}
								{loaderData.karsaApps.nextCursor ? (
									<Button
										variant="outline"
										color="dark"
										size="sm"
										fz="sm"
										radius="lg"
										onClick={() =>
											handlerSearchParams({
												nextCursor: loaderData.karsaApps.nextCursor!,
												previousCursor: undefined,
											})
										}
									>
										Next
									</Button>
								) : null}
							</Group>
						) : null}
					</>
				)}
			</AdminPanel>
			<Footer />
		</div>
	);
}

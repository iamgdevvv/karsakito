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
	TextInput,
	Title,
} from '@mantine/core';
import { useCallback, useMemo } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FaSort } from 'react-icons/fa';
import { HiOutlineSearch } from 'react-icons/hi';
import { LuTrash } from 'react-icons/lu';
import { redirect, useNavigation, useSearchParams } from 'react-router';
import { optionsUserRole } from '~app-modules/enum-options';
import { metaAdminRoute } from '~app-modules/meta';
import type { PayloadQueryUsers } from '~app-modules/schema/user';
import { toSearchParams } from '~app-modules/utils';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { actionGetUsers } from '~app-server/user';
import { ButtonLink, Link } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';
import type { UserScalarFieldEnum } from '~generated/prisma/internal/prismaNamespace';

import type { Route } from './+types/admin.users._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		guard: {
			role: ['ADMIN'],
		},
		request,
	});

	if ('error' in authSession) {
		if (authSession.cause === 'user_not_authorized_role') {
			throw redirect('/');
		}

		throw redirect('/login?redirect=/admin/users');
	}

	context.set(authUserCtx, authSession.user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;
	const users = await actionGetUsers({ request, context });

	return {
		user,
		users,
	};
}

export function meta(_: Route.MetaArgs) {
	return metaAdminRoute({
		title: 'Manage Users',
	});
}

export default function UsersAdminRoute({ loaderData }: Route.ComponentProps) {
	const navigation = useNavigation();
	// const isNavigating = useMemo(() => Boolean(navigation.location), [navigation.location]);
	const [searchParams, setSearchParams] = useSearchParams();

	const handlerSearchParams = useCallback(
		(payload: PayloadQueryUsers) => {
			setSearchParams(
				toSearchParams({
					...loaderData.users.params,
					...payload,
				}),
			);
		},
		[loaderData.users.params],
	);

	const handlerResetParams = useCallback(() => {
		setSearchParams({});
	}, []);

	const hasParams = useMemo(() => {
		const queryParams = Object.fromEntries(searchParams);

		return Object.values(queryParams).some(Boolean);
	}, [loaderData.users.params]);

	const hasParamOrderBy = useMemo(() => {
		if (typeof loaderData.users.params?.asc === 'string') {
			return !!loaderData.users.params.asc;
		}

		if (typeof loaderData.users.params?.desc === 'string') {
			return !!loaderData.users.params.desc;
		}

		return loaderData.users.params?.asc?.length || loaderData.users.params?.desc?.length;
	}, [loaderData.users.params]);

	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel className="site-main">
				<Title mb="lg">Manage Users</Title>
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
								to="/admin/users/create"
								variant="light"
								size="xs"
								fz="xs"
								radius="md"
							>
								Create New
							</ButtonLink>
							<TextInput
								name="search"
								defaultValue={loaderData.users.params?.search}
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
									name="role"
									size="xs"
									defaultValue={loaderData.users.params?.role}
									data={optionsUserRole}
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
													typeof loaderData.users.params?.asc === 'string'
														? [loaderData.users.params.asc]
														: loaderData.users.params?.asc
												}
												data={
													[
														'email',
														'name',
														'createdAt',
														'updatedAt',
													] satisfies UserScalarFieldEnum[]
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
													typeof loaderData.users.params?.desc ===
													'string'
														? [loaderData.users.params.desc]
														: loaderData.users.params?.desc
												}
												data={
													[
														'email',
														'name',
														'createdAt',
														'updatedAt',
													] satisfies UserScalarFieldEnum[]
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
										<Table.Td miw={160}>Email</Table.Td>
										<Table.Td miw={88}>Role</Table.Td>
										<Table.Td miw={80}>Status</Table.Td>
										<Table.Td ta="center">Action</Table.Td>
									</Table.Tr>
								</Table.Thead>
								{loaderData.users.data.length ? (
									<Table.Tbody>
										{loaderData.users.data.map((user, index) => (
											<Table.Tr key={`${user.id}-${index}`}>
												<Table.Td>{user.name}</Table.Td>
												<Table.Td>{user.email}</Table.Td>
												<Table.Td>{user.role}</Table.Td>
												<Table.Td>
													{user.isActive ? (
														<Badge
															variant="light"
															color="green"
															tt="none"
															fw={500}
														>
															Active
														</Badge>
													) : (
														<Badge
															variant="light"
															color="red"
															tt="none"
															fw={500}
														>
															Inactive
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
																to={`/admin/users/${user.id}`}
															>
																Update
															</Menu.Item>
															<Menu.Item
																component={Link}
																to={`/admin/users/${user.id}/change-password`}
															>
																Change Password
															</Menu.Item>
															<Menu.Item
																component={Link}
																to={`/admin/users/${user.id}/delete`}
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
									<Table.Caption>Users not found</Table.Caption>
								)}
							</Table>
						</Box>
						{loaderData.users.previousCursor || loaderData.users.nextCursor ? (
							<Group
								justify="flex-end"
								gap="xs"
								mt="md"
							>
								{loaderData.users.previousCursor ? (
									<Button
										variant="outline"
										color="dark"
										size="sm"
										fz="sm"
										radius="lg"
										onClick={() =>
											handlerSearchParams({
												previousCursor: loaderData.users.previousCursor!,
												nextCursor: undefined,
											})
										}
									>
										Previous
									</Button>
								) : null}
								{loaderData.users.nextCursor ? (
									<Button
										variant="outline"
										color="dark"
										size="sm"
										fz="sm"
										radius="lg"
										onClick={() =>
											handlerSearchParams({
												nextCursor: loaderData.users.nextCursor!,
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

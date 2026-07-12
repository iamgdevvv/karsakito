import { Alert, Badge, Button, DataList, Group, Text, Timeline, Title } from '@mantine/core';
import { replace } from 'react-router';
import { labelUserRole } from '~app-modules/enum-options';
import { metaAdminRoute } from '~app-modules/meta';
import { dayjs } from '~app-modules/utils';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { actionGetUser, actionUpdateUserPassword } from '~app-server/user';
import { messageActionError } from '~app-server/utils';
import { ButtonLink } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/admin.users.$id._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		guard: {
			role: ['ADMIN'],
		},
		request,
	});

	if ('error' in authSession) {
		const redirectParams = new URLSearchParams();
		redirectParams.set('errorMessage', messageActionError(authSession));

		throw replace(`/?${redirectParams.toString()}`);
	}

	context.set(authUserCtx, authSession.user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context, params }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;

	const recordUser = await actionGetUser({
		userId: params.id,
		withBalance: true,
		request,
		context,
	});

	if (!recordUser.data) {
		throw replace('/');
	}

	return {
		user,
		recordUser: recordUser.data,
	};
}

export async function action({ request, context }: Route.ActionArgs) {
	return await actionUpdateUserPassword({
		request,
		context,
	});
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaAdminRoute({
		title: `Ballance User ${loaderData.recordUser.name}`,
	});
}

export default function BallanceUserAdminRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel
				authUser={loaderData.user}
				className="site-main"
			>
				<Title mb="lg">Ballance User</Title>
				<DataList>
					<DataList.Item>
						<DataList.ItemLabel>Name</DataList.ItemLabel>
						<DataList.ItemValue>{loaderData.recordUser.name}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Email</DataList.ItemLabel>
						<DataList.ItemValue>{loaderData.recordUser.email}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Role</DataList.ItemLabel>
						<DataList.ItemValue>
							{labelUserRole[loaderData.recordUser.role]}
						</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Status</DataList.ItemLabel>
						<DataList.ItemValue>
							{loaderData.recordUser.isActive ? (
								<Badge
									size="md"
									variant="light"
									color="green"
									tt="none"
									fw={500}
								>
									Active
								</Badge>
							) : (
								<Badge
									size="md"
									variant="light"
									color="red"
									tt="none"
									fw={500}
								>
									Inactive
								</Badge>
							)}
						</DataList.ItemValue>
					</DataList.Item>
					{loaderData.recordUser.balances ? (
						<>
							<DataList.Item>
								<DataList.ItemLabel>Token</DataList.ItemLabel>
								<DataList.ItemValue>
									{loaderData.recordUser.balances.token}
								</DataList.ItemValue>
							</DataList.Item>
							<DataList.Item>
								<DataList.ItemLabel>Token Daily</DataList.ItemLabel>
								<DataList.ItemValue>
									{loaderData.recordUser.balances.tokenDaily}
								</DataList.ItemValue>
							</DataList.Item>
						</>
					) : null}
				</DataList>

				<Group
					mt="xl"
					mb="lg"
				>
					<Title
						order={2}
						fz="xl"
					>
						Ballance Activity
					</Title>
					<Group
						gap="xs"
						ml="auto"
					>
						<ButtonLink
							to={`/admin/users/${loaderData.recordUser.id}/ballance/update`}
							variant="light"
							size="sm"
							fz="xs"
							radius="md"
						>
							Adjust Balance
						</ButtonLink>
						<Button
							variant="outline"
							size="sm"
							fz="xs"
							radius="md"
						>
							View All Activity
						</Button>
					</Group>
				</Group>
				{loaderData.recordUser.balances &&
				'activities' in loaderData.recordUser.balances ? (
					loaderData.recordUser.balances.activities.length ? (
						<Timeline>
							{loaderData.recordUser.balances.activities.map((activity, index) => (
								<Timeline.Item
									key={`${activity.type}-${index}`}
									title={
										<Text
											span
											size="xs"
											fw={700}
										>
											{activity.type}
										</Text>
									}
								>
									{activity.description ? (
										<Text
											c="dimmed"
											size="sm"
										>
											{activity.description}
										</Text>
									) : null}

									<Text
										size="xs"
										mt={4}
										title={dayjs(activity.createdAt).toString()}
									>
										{dayjs(activity.createdAt).fromNow()}
									</Text>
								</Timeline.Item>
							))}
						</Timeline>
					) : (
						<Alert
							color="red"
							title="Error"
						>
							Ballance Activity failed to load
						</Alert>
					)
				) : (
					<Text c="dimmed">Ballance Activity not found</Text>
				)}
			</AdminPanel>
			<Footer />
		</div>
	);
}

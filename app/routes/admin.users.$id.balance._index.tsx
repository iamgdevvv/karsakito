import { Alert, Badge, Button, DataList, Group, Text, Timeline, Title } from '@mantine/core';
import { LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { LuGift, LuHandHeart } from 'react-icons/lu';
import { TbApiApp } from 'react-icons/tb';
import { replace } from 'react-router';
import { labelUserRole } from '~app-modules/enum-options';
import { metaAdminRoute } from '~app-modules/meta';
import { dayjs } from '~app-modules/utils';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { actionGetUser } from '~app-server/user';
import { messageActionError } from '~app-server/utils';
import { ButtonLink } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/admin.users.$id.balance._index';

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

export function meta({ loaderData }: Route.MetaArgs) {
	return metaAdminRoute({
		title: `Balance User ${loaderData.recordUser.name}`,
	});
}

export default function BalanceUserAdminRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel
				authUser={loaderData.user}
				className="site-main"
			>
				<Title mb="lg">Balance User</Title>
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
						Balance Activity
					</Title>
					<Group
						gap="xs"
						ml="auto"
					>
						<ButtonLink
							to={`/admin/users/${loaderData.recordUser.id}/balance/update`}
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
						<Timeline
							active={loaderData.recordUser.balances.activities.length}
							lineWidth={2}
							bulletSize={20}
						>
							{loaderData.recordUser.balances.activities.map((activity, index) => (
								<Timeline.Item
									key={`${activity.type}-${index}`}
									bullet={
										activity.type === 'DAILY_BONUS' ? (
											<LuGift />
										) : activity.type === 'GIVEAWAY' ? (
											<LuHandHeart />
										) : activity.type === 'KARSA' ? (
											<TbApiApp />
										) : activity.type === 'PURCHASE' ? (
											<LiaMoneyBillWaveSolid />
										) : undefined
									}
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
										title={dayjs(
											activity.createdAt,
											loaderData.user.timezone,
										).toString()}
									>
										{dayjs(
											activity.createdAt,
											loaderData.user.timezone,
										).fromNow()}
									</Text>
								</Timeline.Item>
							))}
						</Timeline>
					) : (
						<Alert
							color="red"
							title="Error"
						>
							Balance Activity failed to load
						</Alert>
					)
				) : (
					<Text c="dimmed">Balance Activity not found</Text>
				)}
			</AdminPanel>
			<Footer />
		</div>
	);
}

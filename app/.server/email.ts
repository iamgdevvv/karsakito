import { BrevoError, BrevoTimeoutError } from '@getbrevo/brevo';
import { type RouterContextProvider } from 'react-router';
import {
	PayloadContactSchema,
	type PayloadContact,
} from '~app-modules/schema/contact';
import { parseFormData } from '~app-modules/utils';
import { brevoMailer } from '~app-server/context';
import { messageActionError } from '~app-server/utils';

export const actionSendEmailContact = async ({
	request,
	context,
}: {
	request: Request;
	context: Readonly<RouterContextProvider>;
}) => {
	try {
		const formData = await request.formData();
		const body = PayloadContactSchema.parse(parseFormData(formData));

		const brevoClient = brevoMailer(context);

		const result = await brevoClient.transactionalEmails.sendTransacEmail({
			templateId: 2,
			params: {
				...body,
				organization: body.organization || 'N/A',
			} satisfies PayloadContact,
			to: [
				{
					email: 'info@karsakito.web.id',
					name: 'KarsaKito',
				},
			],
		});

		console.log('Email sent:', result);

		return {
			success: true,
		};
	} catch (error) {
		console.log('actionSendEmailContact', error);

		if (error instanceof BrevoTimeoutError) {
			return {
				error: 'Email service is timeout, please try again later',
			};
		}

		if (error instanceof BrevoError) {
			return {
				error: 'Email service is down, please try again later',
			};
		}

		return {
			error: messageActionError(error),
		};
	}
};
export type ActionSendEmailContact = Awaited<
	ReturnType<typeof actionSendEmailContact>
>;

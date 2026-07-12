import { useParams } from 'react-router';

export default function DetailLayanan() {
	const { fitur } = useParams();

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold capitalize">Layanan: {fitur}</h1>
			<p>Ini adalah halaman detail untuk {fitur}.</p>
		</div>
	);
}

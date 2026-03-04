import { Link, useParams } from "react-router";

export default function UserDetailPage() {
	const { id } = useParams();

	return (
		<div className="mx-auto max-w-2xl space-y-4">
			<h1 className="text-2xl font-bold">User Detail</h1>
			<div className="rounded-xl border bg-card p-4">
				<p className="text-sm text-muted-foreground">User ID</p>
				<p className="text-lg font-semibold">{id}</p>
			</div>
			<Link to="/users" className="text-primary underline-offset-4 hover:underline">
				Back to user list
			</Link>
		</div>
	);
}

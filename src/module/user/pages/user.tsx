import { Link } from "react-router";

const users = [
	{ id: "1", name: "John Doe", email: "john@example.com" },
	{ id: "2", name: "Jane Smith", email: "jane@example.com" },
	{ id: "3", name: "Alex Brown", email: "alex@example.com" },
];

export default function UserPage() {
	return (
		<div className="mx-auto max-w-3xl space-y-4">
			<h1 className="text-2xl font-bold">Users</h1>
			<div className="rounded-xl border bg-card p-4">
				<ul className="space-y-3">
					{users.map((user) => (
						<li key={user.id} className="rounded-md border p-3">
							<Link to={`/users/${user.id}`} className="font-medium text-primary">
								{user.name}
							</Link>
							<p className="text-sm text-muted-foreground">{user.email}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

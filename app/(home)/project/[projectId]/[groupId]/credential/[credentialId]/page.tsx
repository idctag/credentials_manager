export default function CredentialPageGroup({
  params,
}: {
  params: { id: string };
}) {
  return <div>Project/Group/Credential: {params.id}</div>;
}

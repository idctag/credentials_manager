export default function GroupPage({ params }: { params: { groupId: string } }) {
  return <div>Project/Group: {params.groupId}</div>;
}

import { useRouter } from "next/router";

function GroupPage() {
  const router = useRouter();

  const { name, id } = router.query;

  return (
    <div>
      <h1>Hello here</h1>
      {name}, {id}
    </div>
  );
}

export default GroupPage;

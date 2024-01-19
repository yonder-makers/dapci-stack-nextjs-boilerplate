import { InferGetServerSidePropsType } from 'next';

export function getServerSideProps() {
  return {
    props: { hey: 3 },
  };
}

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  console.log('b1sau');

  return <div>Ceva: {props.hey}</div>;
}

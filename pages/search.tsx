import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';

const Search: NextPage = () => {
  const router = useRouter();
  const { keyword } = router.query;

  return (
    <Container className="container-custome">
      <h1>Search Page for : {keyword}</h1>
    </Container>
  );
};

export default Search;

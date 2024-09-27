import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import SortableTable from '../../components/table/SortableTable';
import { Article } from '../../components/Article';

type ArticlesProps = {
  articles: Article[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
  const headers: { key: keyof Article & string; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'authors', label: 'Authors' },
    { key: 'source', label: 'Source' },
    { key: 'pubyear', label: 'Publication Year' },
    { key: 'doi', label: 'DOI' },
    { key: 'claim', label: 'Claim' },
    { key: 'evidence', label: 'Evidence' },
  ];

  return (
    <div className="container">
      <h1>Articles Index Page</h1>
      <p>Page containing a table of articles:</p>
      <SortableTable headers={headers} data={articles} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ArticlesProps> = async () => {
  try {
    const response = await axios.get('http://localhost:3003/api/articles');
    const articles = response.data.map((article: any) => ({
      id: article._id,
      title: article.title || '',
      authors: article.authors || [],
      source: article.source || '',
      pubyear: article.pubyear || 0,
      doi: article.doi || '',
      claim: article.claim || '',
      evidence: article.evidence || '',
    }));

    return {
      props: {
        articles,
      },
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      props: {
        articles: [],
      },
    };
  }
};

export default Articles;

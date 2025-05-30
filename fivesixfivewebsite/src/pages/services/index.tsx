import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import ServiceCard from '@/components/ServiceCard';
import { getAllMarkdownDocumentsInDirectory, SimpleMarkdownDocument } from '@/lib/markdown';

interface ServiceFrontMatter {
  title: string;
  excerpt: string;
  // slug is part of SimpleMarkdownDocument, no need to repeat here
}

interface ServicesIndexPageProps {
  services: SimpleMarkdownDocument<ServiceFrontMatter>[];
}

const ServicesIndexPage: NextPage<ServicesIndexPageProps> = ({ services }) => {
  return (
    <>
      <Head>
        <title>Our Services - My Company</title>
        <meta name="description" content="Explore the range of services we offer to help you and your organization thrive." />
      </Head>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Services</h1>
        {services.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                title={service.frontMatter.title}
                excerpt={service.frontMatter.excerpt}
                slug={service.slug} // Pass the slug to ServiceCard
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No services currently available. Please check back later.</p>
        )}
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Fetch services from the 'src/content/services/' directory
  const services = getAllMarkdownDocumentsInDirectory<ServiceFrontMatter>('services');

  return {
    props: {
      services,
    },
  };
};

export default ServicesIndexPage; 
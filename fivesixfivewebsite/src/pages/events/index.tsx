import Head from 'next/head';
import { GetStaticProps, NextPage } from 'next';
import { useEvents, EventsProvider } from '@/context/EventsContext';
import Layout from '@/components/Layout';
import { getAllEvents, Event } from '@/lib/events'; // Import Event type and getAllEvents
// import EventCard from '@/components/EventCard'; // For task 5-5

interface EventsIndexPageProps {
  allEvents: Event[]; // Data fetched by getStaticProps
}

// This component now receives events as props via EventsProvider
function EventsPageContent() {
  const { upcomingEvents, pastEvents, isLoading, error } = useEvents();

  // isLoading and error are less likely with getStaticProps but kept for robustness
  if (isLoading) {
    return <p>Loading events...</p>; // Should ideally not be seen
  }

  if (error) {
    return <p>Error displaying events: {error.message}</p>;
  }

  return (
    <>
      <Head>
        <title>Events | FiveSixFive</title>
        <meta name="description" content="Upcoming and past events from FiveSixFive." />
      </Head>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Events</h1>

          <div id="upcoming-events">
            <h2 className="text-3xl font-semibold mb-6">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map(event => (
                  <div key={event.slug} className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-2 text-blue-600">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-gray-600 text-sm mb-1">Location: {event.location}</p>
                    <p className="text-gray-700 mt-2">{event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming events scheduled at this time. Please check back soon!</p>
            )}
          </div>

          <div id="past-events" className="mt-16">
            <h2 className="text-3xl font-semibold mb-6">Past Events Archive</h2>
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map(event => (
                  <div key={event.slug} className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-50">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">{event.title}</h3>
                    <p className="text-gray-500 text-sm mb-1">Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-gray-500 text-sm mb-1">Location: {event.location}</p>
                    <p className="text-gray-600 mt-2">{event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No past events in the archive.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

const EventsIndexPage: NextPage<EventsIndexPageProps> = ({ allEvents }) => {
  return (
    <EventsProvider initialEvents={allEvents}>
      <Layout>
        <EventsPageContent />
      </Layout>
    </EventsProvider>
  );
};

export const getStaticProps: GetStaticProps<EventsIndexPageProps> = async () => {
  const allEvents = await getAllEvents();
  return {
    props: {
      allEvents,
    },
    revalidate: 60, // Optionally, re-generate the page every 60 seconds
  };
};

export default EventsIndexPage; 
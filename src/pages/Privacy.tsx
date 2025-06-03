
import MainLayout from "@/components/layout/MainLayout";

const Privacy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p>
              We are committed to protecting the privacy of all individuals who use our website. 
              Please read the following statement of our privacy policy:
            </p>
            
            <p>
              At this time, we do not collect any personal information from users of this website. 
              This Privacy Statement may be revised from time to time, so please revisit this page 
              often to remain fully informed of our policies.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;

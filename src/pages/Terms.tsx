
import MainLayout from "@/components/layout/MainLayout";

const Terms = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-2xl font-bold">Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
            
            <h2 className="text-2xl font-bold">Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on this website 
              for personal, non-commercial transitory viewing only. This is the grant of a license, 
              not a transfer of title, and under this license you may not:
            </p>
            <ul className="ml-8 space-y-2">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial);</li>
              <li>attempt to decompile or reverse engineer any software contained on the website;</li>
              <li>remove any copyright or other proprietary notations from the materials.</li>
            </ul>
            
            <h2 className="text-2xl font-bold">Disclaimer</h2>
            <p>
              The materials on this website are provided on an 'as is' basis. Bethany Beach Tabernacle 
              makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties 
              including without limitation, implied warranties or conditions of merchantability, fitness for 
              a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <h2 className="text-2xl font-bold">Limitations</h2>
            <p>
              In no event shall Bethany Beach Tabernacle or its suppliers be liable for any damages 
              (including, without limitation, damages for loss of data or profit, or due to business 
              interruption) arising out of the use or inability to use the materials on this website, 
              even if Bethany Beach Tabernacle or an authorized representative has been notified orally 
              or in writing of the possibility of such damage.
            </p>
            
            <h2 className="text-2xl font-bold">Accuracy of Materials</h2>
            <p>
              The materials appearing on this website could include technical, typographical, or photographic 
              errors. Bethany Beach Tabernacle does not warrant that any of the materials on its website are 
              accurate, complete, or current.
            </p>
            
            <h2 className="text-2xl font-bold">Links</h2>
            <p>
              Bethany Beach Tabernacle has not reviewed all of the sites linked to our website and is not 
              responsible for the contents of any such linked site. The inclusion of any link does not imply 
              endorsement by Bethany Beach Tabernacle of the site. Use of any such linked website is at the 
              user's own risk.
            </p>
            
            <h2 className="text-2xl font-bold">Modifications</h2>
            <p>
              Bethany Beach Tabernacle may revise these terms of service for its website at any time without 
              notice. By using this website, you are agreeing to be bound by the then current version of these 
              terms of service.
            </p>
            
            <h2 className="text-2xl font-bold">Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of Michigan 
              and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;

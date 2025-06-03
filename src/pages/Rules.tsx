
import MainLayout from "@/components/layout/MainLayout";

const Rules = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Community Rules</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p>
              The following rules and regulations govern the rental of properties within 
              The Bethany Beach Tabernacle community. All renters and property owners must 
              adhere to these guidelines to maintain the peaceful and spiritual atmosphere 
              of our community.
            </p>
            
            <h2 className="text-2xl font-bold">General Community Guidelines</h2>
            <ul className="ml-8 space-y-2">
              <li>Respect the quiet and peaceful nature of the community at all times</li>
              <li>Observe quiet hours from 10:00 PM to 8:00 AM daily</li>
              <li>Keep music and voices at respectful volumes</li>
              <li>Maintain cleanliness of common areas and grounds</li>
              <li>Park only in designated areas</li>
              <li>Follow all posted speed limits (walking pace)</li>
            </ul>
            
            <h2 className="text-2xl font-bold">Property Rental Guidelines</h2>
            <ul className="ml-8 space-y-2">
              <li>All rentals must be arranged through authorized property owners</li>
              <li>Maximum occupancy limits must be strictly observed</li>
              <li>No pets allowed unless specifically permitted by property owner</li>
              <li>Smoking is prohibited in all buildings and on porches</li>
              <li>Alcohol consumption should be moderate and discreet</li>
              <li>Check-in and check-out times must be respected</li>
            </ul>
            
            <h2 className="text-2xl font-bold">Prohibited Activities</h2>
            <ul className="ml-8 space-y-2">
              <li>Loud parties or gatherings that disturb others</li>
              <li>Use of fireworks or open flames</li>
              <li>Unauthorized modifications to properties</li>
              <li>Commercial activities or solicitation</li>
              <li>Overnight camping on grounds (except in designated cottages)</li>
              <li>Swimming or water activities without proper supervision</li>
            </ul>
            
            <h2 className="text-2xl font-bold">Beach and Grounds Usage</h2>
            <ul className="ml-8 space-y-2">
              <li>Beach access is a privilege - use responsibly</li>
              <li>Clean up after yourself and dispose of trash properly</li>
              <li>No motorized vehicles on the beach</li>
              <li>Respect posted areas and private property boundaries</li>
              <li>Children must be supervised at all times near water</li>
              <li>No glass containers on the beach</li>
            </ul>
            
            <h2 className="text-2xl font-bold">Spiritual Considerations</h2>
            <ul className="ml-8 space-y-2">
              <li>Sunday morning worship services have priority - maintain reverent atmosphere</li>
              <li>Respect the spiritual nature and purpose of the community</li>
              <li>Dress modestly, especially during worship times</li>
              <li>Avoid activities that would be considered inappropriate for a religious community</li>
            </ul>
            
            <h2 className="text-2xl font-bold">Emergency Procedures</h2>
            <ul className="ml-8 space-y-2">
              <li>In case of emergency, call 911 immediately</li>
              <li>Report any safety hazards to the community office</li>
              <li>Know the location of fire extinguishers and emergency exits</li>
              <li>Severe weather procedures will be posted when applicable</li>
            </ul>
            
            <h2 className="text-2xl font-bold">Consequences for Rule Violations</h2>
            <p>
              Violations of community rules may result in:
            </p>
            <ul className="ml-8 space-y-2">
              <li>Verbal or written warnings</li>
              <li>Immediate termination of rental privileges</li>
              <li>Removal from the property</li>
              <li>Loss of future rental privileges</li>
              <li>Legal action if property damage occurs</li>
            </ul>
            
            <p className="font-bold">
              By using this rental platform and staying in our community, you agree to abide by all 
              rules and regulations. These rules are subject to change and updates will be posted 
              as necessary.
            </p>
            
            <p>
              For questions about these rules or to report violations, please contact the community 
              management office.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Rules;

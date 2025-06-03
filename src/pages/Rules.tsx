
import MainLayout from "@/components/layout/MainLayout";

const Rules = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">BETHANY BEACH TABERNACLE</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-2xl font-bold">GENERAL RULES AND REGULATIONS</h2>
            
            <p>
              The Rules and Regulations of Bethany Beach have been established by the Board of Directors to govern our relationships and preserve the lifestyle we have chosen for this community of Christian believers. They are not intended to be restrictive except as they help us to live in safety and comfort with our neighbors and environment.
            </p>
            
            <p>
              This is not an all-inclusive list, and a guiding principle is to love one another and be respectful to neighbors and their property. It is intended that these rules apply to all leaseholders, guests, and renters.
            </p>
            
            <p>
              The Safety and Security Committee is charged with enforcing rules and regulations.
            </p>
            
            <h3 className="text-xl font-bold">Noise:</h3>
            <p>
              Noises disturbing to neighbors should be minimized, especially before 8 a.m. and after 10 p.m. This includes early morning mowing and the operation of other mechanical or construction equipment.
            </p>
            
            <h3 className="text-xl font-bold">Motorized Vehicles:</h3>
            <ol className="list-decimal ml-8 space-y-2">
              <li>All drivers of motorized vehicles, including mopeds and golf carts, must have a valid driver's license or moped license.</li>
              <li>Bethany Beach speed limit is 10 miles per hour for all motorized vehicles, except as posted differently.</li>
              <li>All motorized vehicles must have proper liability insurance coverage.</li>
              <li>All Bethany Beach vehicle laws are State of Michigan laws and must be observed accordingly.</li>
              <li>All Stop signs must be observed with a complete stop.</li>
              <li>Parking Permits must be displayed at beach parking lot.</li>
            </ol>
            
            <h3 className="text-xl font-bold">Fires and Fireworks:</h3>
            <ol className="list-decimal ml-8 space-y-2" start={7}>
              <li>Open fires are not permitted except when properly attended in designated areas and firepits.</li>
              <li>Use of Michigan legal fireworks is limited to the beach only, and as per Michigan law must be only within the time period of one day before and after a national holiday. Children should be properly supervised.</li>
              <li>Use of other fireworks, firearms, air rifles, pellet guns, bow and arrow or other such devices is not permitted. Hunting is not permitted unless specifically authorized by the board.</li>
              <li>Leaf burning is not permitted in Bethany Beach.</li>
            </ol>
            
            <h3 className="text-xl font-bold">Camping:</h3>
            <ol className="list-decimal ml-8 space-y-2" start={11}>
              <li>Camping on the beach is not permitted.</li>
              <li>No mobile homes, campers or portable shelters may be used as living quarters.</li>
            </ol>
            
            <h3 className="text-xl font-bold">Alcohol and illegal drugs:</h3>
            <ol className="list-decimal ml-8 space-y-2" start={13}>
              <li>Illegal drugs are not allowed at Bethany Beach.</li>
              <li>Alcohol is not permitted outside of private residences, and specifically is not permitted on the beach, park, streets, or other common areas.</li>
              <li>Smoking is not permitted in common areas including the beach.</li>
            </ol>
            
            <h3 className="text-xl font-bold">Pets:</h3>
            <ol className="list-decimal ml-8 space-y-2" start={16}>
              <li>Dogs and other pets must be on a leash when outdoors at all times.</li>
              <li>Dogs are not permitted on the beach except at designated times.</li>
              <li>Owners must clean up after their pets.</li>
            </ol>
            
            <h3 className="text-xl font-bold">Curfew:</h3>
            <p>
              We abide by Chikaming Township regulations which states curfew for those under 17 years old is 11:00 pm, except while participating in a scheduled Youth Activity.
            </p>
            
            <h3 className="text-xl font-bold">Worship and Sunday Activities:</h3>
            <ol className="list-decimal ml-8 space-y-2" start={19}>
              <li>The park, tennis courts, and playground are not to be used during the Tabernacle services.</li>
              <li>Construction work is discouraged on Sundays during the season.</li>
              <li>Use of motorized lawn equipment is discouraged on Sundays during the season.</li>
            </ol>
            
            <h3 className="text-xl font-bold">Beach Access:</h3>
            <p>
              Roads to and from the beach are closed to all except top of the hill residents from 10:30 pm Saturday until 1:00 pm Sunday, and from 10:30 pm until 9:00 am Sunday through Friday, during the season.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Rules;

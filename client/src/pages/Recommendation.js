import Mood from "../component/Mood";
import BasedOnHistory from "../component/BasedOnHistory";
import { SectionWrapper } from "../component";

const Recommendation = () => {
  return (
    <main>
      <SectionWrapper title="Recommend For You" breadcrumb={true}>
        <div>
          <Mood />
          <BasedOnHistory />
        </div>
      </SectionWrapper>
    </main>
  );
};

export default Recommendation;

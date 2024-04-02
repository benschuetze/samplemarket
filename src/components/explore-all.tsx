import { SampleBundle } from "./bundle-card";

export const ExploreAllContainer = () => {
  //here i will request all the latest uplóaded sample bundles and render
  //each one as a SampleBundle component

  return (
    <div>
      <SampleBundle /> <SampleBundle /> <SampleBundle /> <SampleBundle />
      <SampleBundle /> <SampleBundle /> <SampleBundle />
    </div>
  );
};

import { SampleBundle } from "./bundle-card";

export const ExploreAllContainer = () => {
  //here i will request all the latest uplóaded sample bundles and render
  //each one as a SampleBundle component

  return (
    <div className="flex flex-wrap ">
      <SampleBundle /> <SampleBundle /> <SampleBundle />
      <SampleBundle />
      <SampleBundle /> <SampleBundle /> <SampleBundle />
    </div>
  );
};

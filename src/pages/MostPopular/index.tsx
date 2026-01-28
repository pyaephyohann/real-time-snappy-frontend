import Marquee from "react-fast-marquee";
import Metadata from "../../components/Metadata";
import { friendDatas } from "../../utils/datas";

const MostPopular = () => {
  return (
    <div className="relative z-30">
      <Metadata title="Most Popular | Snappy" />
      <div className="px-[1rem] pt-[1rem] lg:px-[4rem] my-[3.5rem]">
        <h1 className="text-center text-snap-white text-4xl md:text-5xl font-bold mb-[3rem]">
          Most Popular
        </h1>
        <Marquee
          gradient={false}
          pauseOnClick={true}
          speed={60}
          delay={0}
          play={true}
          direction="left"
          className=""
        >
          {friendDatas.map((item, index) => {
            return (
              <div className="m-[1rem] cursor-pointer" key={index}>
                <img
                  className="rounded-lg w-[15rem] h-[10rem] lg:h-[15rem]"
                  src={item.url}
                  alt={item.name}
                />
                <h3 className="text-xl text-snap-white font-bold text-center mt-[1rem]">
                  {item.name}
                </h3>
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
};

export default MostPopular;

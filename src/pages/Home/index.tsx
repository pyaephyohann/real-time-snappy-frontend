import { useEffect } from "react";
import Metadata from "../../components/Metadata";
import { friendDatas } from "../../utils/datas";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Metadata title="Snappy | Welcome Home" />

      <div className="flex flex-wrap w-[70%] mx-auto mt-[2rem] justify-center">
        {friendDatas.map((ele) => {
          return (
            <div
              onClick={() => navigate(`/snaps/${ele.id}`)}
              className="m-[1rem] cursor-pointer"
              key={ele.id}
            >
              <img
                className="rounded-full h-[8rem] w-[8rem] object-cover"
                src={ele.url}
                alt={ele.name}
              />
              <h3 className="text-center text-snap-white font-semibold mt-[0.8rem]">
                {ele.name}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;

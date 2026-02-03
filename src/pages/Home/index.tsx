import { useCallback, useEffect, useState } from "react";
import Metadata from "../../components/Metadata";
import { friendDatas } from "../../utils/datas";
import { useNavigate } from "react-router-dom";
import ThoughtBubble from "../../components/ThoughtBubble";
import { config } from "../../config";

const Home = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(0);
  const [shuffledSnaps, setShuffledSnaps] = useState([]);

  const shuffleArray = (array: []) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const logInToken = localStorage.getItem("logInToken");

  const handleGetAllSnaps = useCallback(async () => {
    if (!logInToken) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/snaps`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${logInToken}`,
        },
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson?.message || "Failed to load snaps");
      }
      setShuffledSnaps(shuffleArray(responseJson.datas.data));
    } catch (error: any) {
      // silent fail
    }
  }, [logInToken]);

  console.log(shuffledSnaps);

  useEffect(() => {
    handleGetAllSnaps();
  }, [handleGetAllSnaps]);

  return (
    <div>
      <Metadata title="Snappy | Welcome Home" />

      <div className="flex w-[70%] mx-auto mt-[11rem] space-x-[1rem] justify-center">
        {friendDatas.map((ele) => (
          <div
            key={ele.id}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredId(ele.id)}
            onMouseLeave={() => setHoveredId(0)}
            onClick={() => navigate(`/snaps/${ele.id}`)}
          >
            <div className="w-12 h-12 relative">
              <img
                src={ele.url}
                alt={ele.name}
                className="w-full h-full rounded-full object-cover"
              />
              {hoveredId === ele.id && (
                <div className="absolute -top-[4.5rem] -right-[1rem]">
                  <ThoughtBubble text={ele.name} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

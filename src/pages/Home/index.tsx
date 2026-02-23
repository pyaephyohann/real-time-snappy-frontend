import { useCallback, useEffect, useState } from "react";
import Metadata from "../../components/Metadata";
import { friendDatas } from "../../utils/datas";
import { useNavigate } from "react-router-dom";
import ThoughtBubble from "../../components/ThoughtBubble";
import { config } from "../../config";
import SnapCard from "../snaps/components/SnapCard";

const Home = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(0);
  const [shuffledSnaps, setShuffledSnaps] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);

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
          Accept: "application/json",
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

  const handleGetAllUsers = useCallback(async () => {
    if (!logInToken) return;
    const response = await fetch(`${config.apiBaseUrl}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${logInToken}`,
      },
    });
    const responseJson = await response.json();
    setUsers(responseJson.datas.data);
  }, [logInToken]);

  useEffect(() => {
    handleGetAllSnaps();
    handleGetAllUsers();
  }, [handleGetAllSnaps, handleGetAllUsers]);

  return (
    <div>
      <Metadata title="Snappy | Welcome Home" />
      {/* Friend Datas */}
      <div className="flex w-[70%] mx-auto mt-[11rem] space-x-[1rem] justify-center">
        {users.map((ele: any) => (
          <div
            key={ele.id}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredId(ele.id)}
            onMouseLeave={() => setHoveredId(0)}
            onClick={() => navigate(`/snaps/${ele.id}`)}
          >
            <div className="w-12 h-12 relative">
              <img
                src={ele.avatar_url}
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
      {/* Snaps */}
      <div className="p-[3rem]">
        {!shuffledSnaps.length ? (
          <p
            className="
            text-center
            text-xl sm:text-2xl
            font-bold
            mt-16
            text-snap-white
            opacity-70
          "
          >
            No snaps yet 📭
          </p>
        ) : (
          <div
            className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
            justify-center
          "
          >
            {shuffledSnaps.map((snap: any) => (
              <div key={snap.id} className="flex justify-center">
                <SnapCard
                  id={snap.id}
                  url={snap.url}
                  caption={snap.caption}
                  uploadedBy={snap.uploaded_by}
                  reactions_count={snap.reactions_count}
                  reactions={snap.reactions}
                  comments={snap.comments}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

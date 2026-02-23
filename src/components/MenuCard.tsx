import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";

interface Props {
  setOpen: (value: boolean) => void;
}

const MenuCard = ({ setOpen }: Props) => {
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("logInToken");
    localStorage.removeItem("currentUser");
    navigate("/auth/sign-in");
    setOpen(false);
  };

  return (
    <div className="bg-white p-[1.5rem] w-[12rem] rounded-md flex flex-col gap-[1.2rem]">
      <ConfirmationDialog
        open={openConfirmationDialog}
        setOpen={setOpenConfirmationDialog}
        title="Log Out"
        bodyText="Are you sure you want to log out?"
        callBack={handleLogOut}
      />
      {/*. Home */}
      <Link
        onClick={() => setOpen(false)}
        className="font-bold gradient-color hover:opacity-80 flex space-x-[0.6rem] items-center"
        to={`/home`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-5"
        >
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="35%" stopColor="#ff69b4" />
              <stop offset="100%" stopColor="#ffa07a" />
            </linearGradient>
          </defs>

          <path
            fill="url(#grad)"
            d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"
          />

          <path
            fill="url(#grad)"
            d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"
          />
        </svg>

        <span>Home</span>
      </Link>
      {/* Snaps */}
      <Link
        onClick={() => setOpen(false)}
        className="font-bold gradient-color hover:opacity-80 flex space-x-[0.6rem] items-center"
        to={`/snaps`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-6"
        >
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="35%" stopColor="#ff69b4" />
              <stop offset="100%" stopColor="#ffa07a" />
            </linearGradient>
          </defs>

          <path
            fill="url(#grad)"
            fillRule="evenodd"
            clipRule="evenodd"
            d="
      M3.75 4.5A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5h16.5
      a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75ZM12 7.875
      a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM7.41
      10.591a2.25 2.25 0 0 1 3.18 0l5.16 5.159 1.41-1.409
      a2.25 2.25 0 0 1 3.18 0l.66.66V18H4.5v-2.25l2.91-2.909Z
    "
          />
        </svg>

        <span>Snaps</span>
      </Link>
      {/*. Collections */}
      <Link
        onClick={() => setOpen(false)}
        className="font-bold gradient-color hover:opacity-80 flex space-x-[0.6rem] items-center"
        to={`/collections`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-5"
        >
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="35%" stopColor="#ff69b4" />
              <stop offset="100%" stopColor="#ffa07a" />
            </linearGradient>
          </defs>

          <path
            fill="url(#grad)"
            d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
          />

          <path
            fill="url(#grad)"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
          />

          <path
            fill="url(#grad)"
            d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z"
          />
        </svg>

        <span>Collections</span>
      </Link>
      {/*. Popular */}
      <Link
        onClick={() => setOpen(false)}
        className="font-bold gradient-color hover:opacity-80 flex space-x-[0.6rem] items-center"
        to={`/most-popular`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-6"
        >
          <defs>
            <linearGradient
              id="pinkPeachGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="35%" stopColor="#ff69b4" />
              <stop offset="100%" stopColor="#ffa07a" />
            </linearGradient>
          </defs>

          <path
            fill="url(#pinkPeachGradient)"
            fillRule="evenodd"
            d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
            clipRule="evenodd"
          />
        </svg>

        <span>Most Popular</span>
      </Link>
      <button
        onClick={() => {
          setOpenConfirmationDialog(true);
        }}
        className="font-bold gradient-color hover:opacity-80 flex space-x-[0.6rem] items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-5"
        >
          <defs>
            <linearGradient id="logout-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="35%" stopColor="#ff69b4" />
              <stop offset="100%" stopColor="#ffa07a" />
            </linearGradient>
          </defs>

          <path
            fill="url(#logout-grad)"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z"
          />
        </svg>

        <span>Log Out</span>
      </button>
    </div>
  );
};

export default MenuCard;

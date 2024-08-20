import { useNavigate } from "react-router-dom";

export default function BreadCrumbs() {
  const navigate = useNavigate();

  return (
    <nav className="flex border-gray-200 bg-white" aria-label="Breadcrumb">
      <ol
        role="list"
        className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8"
      >
        <li className="flex">
          <div className="flex items-center">
            <a
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-600 cursor-pointer"
            >
              <span className="text-sm pr-1">Bosh sahifa</span>
            </a>
            <i className="text-sm text-gray-500">/</i>
          </div>
        </li>
      </ol>
    </nav>
  );
}

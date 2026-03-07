import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Context from "../../Context";
import Loading from "../layout/Loading";
import { resourceConfig } from "../../resources/config";

const ResourceList = ({ resource }) => {

  const context = useContext(Context.Context);
  const authUser = context.authenticatedUser;
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const config = resourceConfig[resource];

  useEffect(() => {

    if (!authUser?.token) return;

    context.data.getResources(resource, authUser.token)
      .then(response => {

        const userItems = response.filter(item => item.userid === authUser.id);

        setItems(userItems);
        setFilteredItems(userItems);
        setIsLoading(false);

      })
      .catch(error => {

        console.error(error);
        navigate("/error");

      });
    document.title = `${config.title} | FCMS`;
  }, [resource, context.data, authUser.id, authUser.token, config.title, navigate]);

  if (isLoading) return <Loading />;

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {config.plural}
      </h1>

      <div className="mb-4 text-lg font-semibold text-gray-700">
        Total {config.plural}: {items.length}
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">

          <thead>

            <tr className="bg-gray-200 border-b border-gray-300">

              {config.tableFields.map(field => (

                <th key={field.name} className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  {field.label}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {filteredItems.map(item => (

              <tr
                key={item.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/${resource}/${item.id}`)}
              >

                {config.tableFields.map(field => (

                  <td key={field.name} className="px-6 py-4 text-sm text-gray-800">

                    {field.type === "date"
                      ? new Date(item[field.name]).toLocaleDateString()
                      : item[field.name]}

                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-6">

        <Link
          to={`/${resource}/create`}
          className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          New {config.title}
        </Link>

      </div>

      <div className="mt-6">

        <Link
          to={`/${resource}/report`}
          className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Generate Report
        </Link>

      </div>

    </div>

  );

};

export default ResourceList;
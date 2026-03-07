import React, { useState, useEffect, useContext } from "react";
import Context from "../../Context";
import Loading from "../layout/Loading";
import { resourceConfig } from "../../resources/config";

const ResourceReport = ({ resource }) => {

  const context = useContext(Context.Context);
  const authUser = context.authenticatedUser;

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const config = resourceConfig[resource];

  useEffect(() => {

    context.data.getResources(resource, authUser.token)
      .then(response => {

        const userItems = response.filter(i => i.userid === authUser.id);

        setItems(userItems);
        setIsLoading(false);

      });

  }, [resource, context.data, authUser.id, authUser.token]);

  if (isLoading) return <Loading />;

  return (

    <div className="max-w-4xl mx-auto p-8 bg-white text-black">

      <h1 className="text-4xl font-bold mb-6 border-b-4 border-black pb-4 text-center">
        {config.title} Report
      </h1>

      <table className="w-full border-collapse border border-gray-400 text-left">

        <thead className="bg-gray-100">

          <tr>

            {config.fields.map(field => (

              <th key={field.name} className="border border-gray-400 px-4 py-2">
                {field.label}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {items.map(item => (

            <tr key={item.id}>

              {config.fields.map(field => (

                <td key={field.name} className="border border-gray-400 px-4 py-2">

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

  );

};

export default ResourceReport;
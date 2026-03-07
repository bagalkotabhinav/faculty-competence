import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Context from "../../Context";
import Loading from "../layout/Loading";
import { resourceConfig } from "../../resources/config";

const ResourceDetail = ({ resource }) => {

  const context = useContext(Context.Context);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const config = resourceConfig[resource];

  useEffect(() => {

    if (!authUser?.token) return;

    context.data.getResource(resource, id, authUser.token)
      .then(response => {

        if (response.id) {

          setItem(response);

        } else {

          navigate("/notfound");

        }

      })
      .catch(() => navigate("/error"))
      .finally(() => setIsLoading(false));

  }, [resource, id, context.data, authUser.token, navigate]);

  const handleDelete = () => {

    context.data.deleteResource(resource, id, authUser.token)
      .then(() => navigate(`/${resource}`))
      .catch(() => navigate("/error"));

  };

  if (isLoading) return <Loading />;

  return (

    <div>

      <div className="actions--bar">

        <div className="wrap">

          {authUser.id === item.userid && (

            <>
              <Link to={`/${resource}/${id}/update`} className="button">
                Update {config.title}
              </Link>

              <button className="button" onClick={handleDelete}>
                Delete {config.title}
              </button>
            </>

          )}

          <Link to={`/${resource}`} className="button button-secondary">
            Return to List
          </Link>

        </div>

      </div>

      <div className="wrap">

        <h2>{config.title} Detail</h2>

        <div className="main--flex">

          <div>

            <h3 className="course--detail--title">{config.title}</h3>
            <h4 className="course--name">{item.title}</h4>

            {config.fields.slice(1).map(field => (

              <p key={field.name}>
                <strong>{field.label}:</strong>{" "}
                {field.type === "date"
                  ? new Date(item[field.name]).toLocaleDateString()
                  : item[field.name]}
              </p>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

};

export default ResourceDetail;
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Context from "../../Context";
import Loading from "../layout/Loading";
import { resourceConfig } from "../../resources/config";

const ResourceForm = ({ resource, mode }) => {

  const context = useContext(Context.Context);
  const authUser = context.authenticatedUser;
  const navigate = useNavigate();
  const { id } = useParams();

  const config = resourceConfig[resource];

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(mode === "update");

  useEffect(() => {

    if (mode !== "update") return;

    context.data.getResource(resource, id, authUser.token)
      .then(data => {

        if (data.userid !== authUser.id) {
          navigate("/forbidden");
          return;
        }

        setFormData(data);
        setIsLoading(false);

      })
      .catch(() => navigate("/error"));

  }, [mode, resource, id, context.data, authUser.id, authUser.token, navigate]);


  const change = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };


  const submit = async (e) => {

  e.preventDefault();

  try {

    const payload = {};

    config.fields.forEach(field => {
      payload[field.name] = formData[field.name];
    });

    payload.userid = authUser.id;

    let errors;

    if (mode === "create") {

      errors = await context.data.createResource(
        resource,
        payload,
        authUser.token
      );

    } else {

      errors = await context.data.updateResource(
        resource,
        id,
        payload,
        authUser.token
      );

    }

    if (errors?.length) {

      setErrors(errors);

    } else {

      navigate(`/${resource}`);

    }

  } catch (err) {

    console.error("Update/Create failed:", err);
    navigate("/error");

  }

};


  const cancel = () => navigate(`/${resource}`);


  if (isLoading) return <Loading />;


  return (

    <div className="wrap">

      <h2>
        {mode === "create"
          ? `Create ${config.title}`
          : `Update ${config.title}`}
      </h2>

      {errors.length > 0 && (

        <div className="validation--errors">

          <h3>Validation Errors</h3>

          <ul>
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>

        </div>

      )}

      <form onSubmit={submit}>

        <div className="main--flex">

          <div>

            {config.fields.map(field => (

              <React.Fragment key={field.name}>

                <label>{field.label}</label>

                <input
                  name={field.name}
                  type={field.type || "text"}
                  value={
                    field.type === "date" && formData[field.name]
                      ? formData[field.name].split("T")[0]
                      : formData[field.name] || ""
                  }
                  onChange={change}
                />

              </React.Fragment>

            ))}

          </div>

        </div>

        <button className="button" type="submit">
          {mode === "create" ? "Create" : "Update"} {config.title}
        </button>

        <button
          className="button button-secondary"
          type="button"
          onClick={cancel}
        >
          Cancel
        </button>

      </form>

    </div>

  );

};

export default ResourceForm;
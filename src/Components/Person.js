import React from "react";

const Person = (props) => {
  return (
    <>
      <span>
        {props.name} {props.number}
      </span>
      <button onClick={() => props.onClick(props.id)}>delete</button> <br />
    </>
  );
};

export default Person;

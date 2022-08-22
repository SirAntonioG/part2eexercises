import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((res) => res.data);
};

const create = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then((res) => res.data);
};

const erase = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const update = (id, newPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, newPerson);
  return request.then((res) => res.data);
};

const personService = { getAll, create, update, erase };

export default personService;

import { useState, useEffect } from "react";
import personService from "./services/persons";
import Persons from "./Components/Persons";
import PersonForm from "./Components/PersonForm";
import Filter from "./Components/Filter";
import Notification from "./Components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filteredByName, setFilteredByName] = useState([]);
  const [filterStatus, setFilterStatus] = useState(false);
  const [message, setMessage] = useState({});

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const nameAlreadyAdded = persons.some((person) => person.name === newName);
  const personsToShow = filterStatus ? filteredByName : persons;

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    if (nameAlreadyAdded) {
      const confirm = window.confirm(
        `${newName} is already added to phonebook, replace the old number with the new one?`
      );
      if (confirm) {
        const personToUpdate = persons.find(
          (person) => person.name === newPerson.name
        );
        const changedPerson = { ...personToUpdate, number: newPerson.number };
        personService
          .update(personToUpdate.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((item) =>
                item.id !== personToUpdate.id ? item : returnedPerson
              )
            );
            setMessage({
              type: "message done",
              text: `${returnedPerson.name}'s number has been replaced`,
            });
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          });
      } else {
        setNewName("");
        setNewNumber("");
        setFilterStatus(false);
        setFilterValue("");
      }
    } else {
      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setMessage({
          type: "message done",
          text: `Added ${returnedPerson.name} to Phonebook successfully`,
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);

        setNewName("");
        setNewNumber("");
        setFilterStatus(false);
        setFilterValue("");
      });
    }
  };
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    const regexp = new RegExp(event.target.value, "i");
    setFilteredByName(persons.filter((person) => regexp.test(person.name)));
    event.target.value === "" ? setFilterStatus(false) : setFilterStatus(true);
  };

  const deletePersonClick = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    const confirm = window.confirm(
      `Are you sure you want to delete ${personToDelete.name}?`
    );
    if (confirm) {
      personService
        .erase(id)
        .then((res) => {
          setPersons(persons.filter((item) => item.id !== personToDelete.id));
          setMessage({
            type: "message done",
            text: `${personToDelete.name}'s information was deleted successfully`,
          });
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setMessage({
            type: "message error",
            text: `Information of ${personToDelete.name} has already been deleted from server`,
          });
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={filterValue} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        nameOnChange={handleNameChange}
        numberValue={newNumber}
        numberOnChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePersonClick} />
    </div>
  );
};

export default App;

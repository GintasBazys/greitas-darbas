import React from "react";
import {Button} from "react-bootstrap";

interface props {
    employees: boolean,
    setEmployees: any
}

const EmployeeListComponent = ({employees, setEmployees}: props) => {

    const handleHideEmployeeList = () => {
        setEmployees(!employees)
    }

    return (
        <div>
            <h1>Sarasas</h1>
            <Button style={{marginTop: "2rem"}} variant="outline-dark" type="submit" onClick={() => handleHideEmployeeList()}>
                Slėpti darbuotojų sąrašą
            </Button>
        </div>
    )
}
export default EmployeeListComponent;
import React from "react";
import StudentCard from "../components/StudentCard";

class StudentCollection extends React.Component {

  render(){
	  console.log(this.props)
  	return (
		<div className="student-collection">
			{this.props.students.map(student => <StudentCard key={student.id} student={student} updateSearchStudents
			={this.props.updateSearchStudents}/>)}
		</div>
  	);
  }

};

export default StudentCollection;

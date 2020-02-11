import React from "react";
import StudentCollection from './StudentCollection'
import Search from '../components/Search'

class StudentsPage extends React.Component {
  state = {
    searchTerm: "",
    tagSearch: "",
    students: [],
    searchStudents: []
  }


  componentDidMount(){
    fetch(`https://www.hatchways.io/api/assessment/students`)
    .then(resp => resp.json())
    .then(students => this.setState({ 
      students: this.state.students.concat(students.students.map(student => {
        student.tags = []
        return student
      })
    ),
      searchStudents: this.state.searchStudents.concat(students.students.map(student => {
          student.tags = []
          return student
        })
      )
    }))
  }

  showStats = student => {
    this.setState({
      showingStats: true,
      showingStudent: student
    })
  }

  search = e => {
    this.setState({
      searchTerm: e.target.value,
      students: this.state.searchStudents.filter(student => {
        let fullName = `${student.firstName} ${student.lastName}`
        if(fullName.toLowerCase().includes(e.target.value.toLowerCase()))return student
      })
    })
  }

  tagSearch = e => {
    if(e.target.value !== ''){
      this.setState({
        tagSearch: e.target.value,
        students: this.state.searchStudents.filter(student => student.tags.find(tag => tag.toLowerCase().includes(e.target.value.toLowerCase())) !== undefined)
      })
      console.log(this.state)
    }else{
      this.setState({
        tagSearch: e.target.value,
        students: this.state.searchStudents
      })
    }
  }

  updateSearchStudents = (student,tag) => {
    this.setState({
      searchStudents: this.state.searchStudents.filter(stdnt => stdnt.id === student.id ? stdnt.tags.push(tag) : stdnt)
    })
  }

  render() {
    console.log(this.state.searchStudents)
    return (
      <div className="main-screen">
        <Search search={this.search} searchTerm={this.state.searchTerm} searchType={"name"}/>
        <Search search={this.tagSearch} searchTerm={this.state.tagSearch} searchType={"tag"}/>
        <StudentCollection students={this.state.students} updateSearchStudents={this.updateSearchStudents} />
      </div>
    );
  }

}

export default StudentsPage;

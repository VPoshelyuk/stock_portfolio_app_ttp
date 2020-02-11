import React from "react";

const StudentCard = props => {
  const { student } = props

  const findAverage = () => {
    let numOfGrades = 0
    let total = student.grades.reduce(function (acc, curr) {
      numOfGrades++
      return acc + parseInt(curr)
    }, 0)
    return numOfGrades ? total/numOfGrades : "N/A"
  }

  const showFullStats = e => {
    let statsDiv = document.querySelector(`[data-id="${student.id}"]`)
    if(e.target.innerText === '+'){
      e.target.innerText = '‒'
      statsDiv.style.display = "block"
    }else{
      e.target.innerText = '+'
      statsDiv.style.display = "none"
    }
  }

  const addTag = e => {
    e.preventDefault()
    console.log(props)
    document.querySelector(`[data-tagId="${student.id}"]`).innerHTML += `<button class="tag">${e.target[0].value}</button>`
    props.updateSearchStudents(student, e.target[0].value)
    e.target[0].value = ''
  }

  return (
    <div
      className="student-card"
      key={student.id}
    >
      <div className="image-part">
        <img className="img" alt="student_img" src={student.pic} />
      </div>
      <div className="info-part">
        <h1>{student.firstName.toUpperCase()} {student.lastName.toUpperCase()}</h1>
        <div className="misc-info">
          <p>Email: {student.email}</p>
          <p>Company:  {student.company}</p>
          <p>Skill:  {student.skill}</p>
          <p>Average: {findAverage()}%</p>
          <div className="test-stats" data-id={student.id}>
              {student.grades.map((grade, num) => <p key={`student-${student.id}-${num+1}`}>Test {num+1}:   {grade}%</p>)}
              <p style={{marginBottom: "15px"}}></p>
              <div id="tags" data-tagId={student.id}>
              </div>
              <form className="add-tag-form" onSubmit={addTag}>
                <input className="add-tag-input" type="text" placeholder="Add a tag" />
              </form>
          </div>
        </div>
      </div>
        <div className="button-part">
          <button className="expand-btn" onClick={showFullStats}>+</button>
        </div>
    </div>
  );

};

export default StudentCard;

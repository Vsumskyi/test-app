import React from 'react';
import classes from './Results.module.sass'
import { NavLink } from 'react-router-dom'
import { getResults, removeHandler } from '../../../Axios/AxiosQuery'

class Results extends React.Component {
  constructor() {
    super()
    this.state = {
      testItems: {
        tests: [],
        loading: true,
        emptyDB: false,
        id: ''
      },
    }
  }

async componentDidMount() {
   if(!this.props.isAdmin) {
     this.props.linkProps.history.push('/')
      return
    }

  //get results from BD
  await getResults(this.state.testItems)
    .then(testItems => {
    let newArr = testItems.tests.sort((a,b) => a.email < b.email ? -1 : 1)
                                .reduce((accamulator, element)=> {
      if(!accamulator.length || accamulator[accamulator.length - 1].email !== element.email) {
        accamulator.push(element);
      } else {
        removeHandler(element.id)
      }
      return accamulator;
    }, []);
    testItems.tests = [...newArr]
    this.setState({testItems})
  } );
}

removeUserItemHandler = (id ,event) => {
  let isRemove = window.confirm('Видалити результат?')
    if (isRemove) {
      this.props.showAlert(null, "Резульат видалено!",'succes')
      event.target.closest('ul').style.transform = 'translate(-200%)'
      this.remove(event.target.closest('ul'))
      removeHandler(id)
    }
  }

  remove(target) {
    setTimeout(()=> {target.remove()}, 450)
  }

  renderResults = () => {
    let result;
    
    const answerItem = (
      this.state.testItems.tests.map( answerItem =>{
        let id = answerItem.id
        let userInfo = answerItem.userInfo

      return ( 
        <ul key={id}>
          <div>
          <h3>{userInfo.name}</h3>
          <i className={`fas fa-trash-alt`} onClick={(event) => this.removeUserItemHandler(id, event)}></i>
          </div>
          <p> 
            <span>{userInfo.email}</span> 
          </p>
          <h5>{userInfo.nameTest}</h5>
      
          <p>
            <strong>{userInfo.curret}</strong>
          </p>
          <p>{userInfo.date}</p>
            {userInfo.question.map((questionItem, index) => {
            return (
              <li key={index} > 
                {questionItem.curret
                ?<span className={classes.done}>&#10003;</span>
                :<span className={classes.error}>&times;</span>}
              {questionItem.question} 
            </li>)
            })}
        </ul>
      )
    })
  )

  const preloader = (<div 
    className={classes.loading}>
      <p>Завантаження...</p></div>)

  const emptyDB = (<p className={classes.emptyDB}>Ще немає жодного результата</p>)

  if (this.state.testItems.emptyDB) {
    result = emptyDB
  }
  else if (this.state.testItems.loading) {
    result = preloader;
  } 
  else {
    result = answerItem
  }
  return result;
}

render() {
  const cls = [classes.Results, this.props.blackTheme?classes.dark:null]
  return (
  <div className={cls.join(' ')}> 
    <NavLink 
      className={classes.createLink}
      to={'/TestCreator'}>
      +
    </NavLink>
    {this.state.testItems.loading || this.state.testItems.emptyDB
    ?null
    :<p className={classes.countUser}>
     Пройшло <strong>{this.state.testItems.tests.length}</strong>  учасника
      </p>}
    
    {this.renderResults()} 
  </div> )
  }
};

export default Results;
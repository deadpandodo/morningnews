import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux';

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([])
  const [selectedLang, setSelectedLang] = useState(props.selectedLang)


    {console.log(props)}

  useEffect(() => {
    const APIResultsLoading = async() => {
      var langue = 'fr'
      var country = 'fr'

      if(selectedLang === 'en'){
       // var langue = 'en'
       // var country = 'us'
        langue = 'en'
        country = 'us'
      }
      props.changeLang(selectedLang)
      const data = await fetch(`https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=ec644454a14444cf95016e0f7ace2505`)
      const body = await data.json()
      setSourceList(body.sources)
    }

    APIResultsLoading()
  }, [selectedLang])

  var changeLanguage = (languageCode) => {
    setSelectedLang(languageCode)
    // send to the BE (token + language code)
    async function sendLanguageUpdate() {
      var rawResponse = await fetch('/update-language',
      {
        method: 'PUT',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `token=${props.token}&lang=${languageCode}`
       })
      var response = await rawResponse.json();
      console.log("sendLanguageUpdate response : "+JSON.stringify(response))
    }
    sendLanguageUpdate()
  }



  let languageImageStyleFR = {
    width:'40px', 
    margin:'10px',
    cursor:'pointer',
    
  }
  let languageImageStyleEN = {
    width:'40px', 
    margin:'10px',
    cursor:'pointer',
    
  }

  if (selectedLang === "fr") {
    languageImageStyleFR.border = "2px solid white"
    languageImageStyleFR.paddingBlock = "2px"
    languageImageStyleFR.paddingInline = "2px"
  } else {
    languageImageStyleEN.border = "2px solid white"
    languageImageStyleEN.paddingBlock = "2px"
    languageImageStyleEN.paddingInline = "2px"
  }


  return (
    <div>
        <Nav/>

       <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
          <img style={languageImageStyleFR} src='/images/fr.png' onClick={() => changeLanguage('fr') } alt="img description"/>
          <img style={languageImageStyleEN} src='/images/uk.png' onClick={() => changeLanguage('en')} alt="img description"/>
        </div>

       <div className="HomeThemes">

              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={source => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`/images/${source.category}.png`} />}
                        title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                        description={source.description}
                      />
                    </List.Item>
                  )}
                />


          </div>

      </div>
  );
}

function mapStateToProps(state){
  console.log("state : "+JSON.stringify(state))
  return {selectedLang: state.selectedLang, token:state.token}
}

function mapDispatchToProps(dispatch){
  return {
    changeLang: function(selectedLang){
      dispatch({type: 'changeLang', selectedLang: selectedLang})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)

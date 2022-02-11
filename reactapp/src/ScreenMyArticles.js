import React, {useState, useEffect} from 'react';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'

import {connect} from 'react-redux'

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [articleListInLanguage, setArticleListInLanguage] = useState([])


  useEffect(() => {
    setArticleListInLanguage(props.myArticles)
  }, [])



  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)

  }

  var handleOk = e => {
    setVisible(false)
  }

  var handleCancel = e => {
    setVisible(false)
  }

  var noArticles
  if(props.myArticles === 0){
    noArticles = <div style={{marginTop:"30px"}}>No Articles</div>
  }

  var showArticlesIn = (languageCode) => {
    console.log("showArticlesIn, languageCode = "+languageCode)
    let articleArray = [...props.myArticles]
    for (let i=0;i<props.myArticles;i++){
      if (props.myArticles[i].language !== languageCode) {
        articleArray.splice(i, 1)
      }
    }
    console.log(articleArray)
    setArticleListInLanguage(articleArray)
  }

  let languageImageStyle = {
    width:'40px', 
    margin:'10px',
    cursor:'pointer',
    
  }

  return (
    <div>

            <Nav/>

            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
              <img style={languageImageStyle} src='/images/fr.png' onClick={() => showArticlesIn('fr') } alt="img description"/>
              <img style={languageImageStyle} src='/images/uk.png' onClick={() => showArticlesIn('en')} alt="img description"/>
            </div>

            {noArticles}

            <div className="Card">


            {articleListInLanguage.map((article,i) => (
                <div key={i} style={{display:'flex',justifyContent:'center'}}>

                  <Card

                    style={{
                    width: 300,
                    margin:'15px',
                    display:'flex',
                    flexDirection: 'column',
                    justifyContent:'space-between' }}
                    cover={
                    <img
                        alt="example"
                        src={article.urlToImage}
                    />
                    }
                    actions={[
                        <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title,article.content)} />,
                        <Icon type="delete" key="ellipsis" onClick={() => props.deleteToWishList(article.title)} />
                    ]}
                    >

                    <Meta
                      title={article.title}
                      description={article.description}
                    />

                  </Card>
                  <Modal
                    title={title}
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p>{content}</p>
                  </Modal>

                </div>

              ))}

             </div>



      </div>
  );
}

function mapStateToProps(state){
  return {myArticles: state.wishList}
}

function mapDispatchToProps(dispatch){
  return {
    deleteToWishList: function(articleTitle){
      dispatch({type: 'deleteArticle',
        title: articleTitle
      })
    }
  }
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);

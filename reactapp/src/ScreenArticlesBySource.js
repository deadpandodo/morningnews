import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'
import {connect} from 'react-redux'

const { Meta } = Card;

function ScreenArticlesBySource(props) {

  const [articleList, setArticleList] = useState([])

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  var { id } = useParams();

  useEffect(() => {
    const findArticles = async() => {
      const data = await fetch(`https://newsapi.org/v2/top-headlines?sources=${id}&apiKey=ec644454a14444cf95016e0f7ace2505`)
      const body = await data.json()
      setArticleList(body.articles)
    }

    findArticles()
  },[])

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

  const addArticleInWishlist = async (article) => {

    const requeteAddArticleToWishlist = await fetch('/add-article-in-wishlist', {
      method:'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `titleFromFront=${article.title}&descriptionFromFront=${article.description}&contentFromFront=${article.content}&img=${article.urlToImage}&token=${props.token}`
    })

    props.addToWishList(article);
    const dataArticle = await requeteAddArticleToWishlist.json();
    console.log(dataArticle)
  }

  {console.log(props)}
  return (
    <div>

            <Nav/>

            <div className="Banner"/>

            <div className="Card">
              {articleList.map((article,i) => (
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
                      <Icon type="like" key="ellipsis" onClick={() => addArticleInWishlist(article)} />
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
  console.log(state)
  return{token:state.token}
}

function mapDispatchToProps(dispatch){
  return {
    addToWishList: function(article){
      dispatch({type: 'addArticle',
        articleLiked: article
      })
    }
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScreenArticlesBySource)

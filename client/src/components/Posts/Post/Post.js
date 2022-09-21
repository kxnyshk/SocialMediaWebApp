import React from "react";
// added ButtonBase
import {Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
// added InfoIcon
import InfoIcon from '@material-ui/icons/Info';
import { useDispatch } from "react-redux";
import moment from 'moment';

// added getPost
import { getPost, deletePost,likePost } from "../../../actions/posts";
import useStyles from './styles';

const Post = ({post, setCurrentId}) =>{
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    
    const Likes = () => {
        if (post?.likes?.length > 0) {
          return post.likes.find((like) => like === (user?.result?.googleId || user?.result?._id))
            ? (
              <><ThumbUpAltIcon fontSize="small" />&nbsp;{post.likes.length > 2 ? `You and ${post.likes.length - 1} others` : `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}` }</>
            ) : (
              <><ThumbUpAltOutlined fontSize="small" />&nbsp;{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</>
            );
        }
    
        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
      };

    return (
        <Card className={classes.card} raised elevation={6}>
            <CardMedia className = {classes.media} image = {post.selectedFile} title = {post.title}></CardMedia>
              <div className = {classes.overlay}>
                <Typography variant="h6">{post.name}</Typography>
                <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
              </div>
              
              {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                <div className={classes.overlay2} name='edit'>
                  <Button 
                    onClick = {(e) => {
                      e.stopPropagation();
                      setCurrentId(post._id);
                    }}
                    style={{color: 'white'}} 
                    size="small">
                      <MoreHorizIcon fontSize="medium"/>
                  </Button>
                </div>
              )}
           
            <div className={classes.details}>
                <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
            </div>

            <CardContent>
              <Typography className = {classes.title} variant="h5" gutterBottom component='h2'>{post.title}</Typography>
              <Typography variant="body2" color="textSecondary" component="p" >{post.message}</Typography>
            </CardContent>
            
          <CardActions className={classes.cardActions}>
            <Button size = "small" color = "primary" disabled={!user?.result} onClick={() => dispatch(likePost(post._id))}>
               <Likes/>
            </Button>
{(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
    <Button size = "small" color = "secondary" onClick={() => dispatch(deletePost(post._id))}>
    <DeleteIcon fontSize="small"/>
        Delete

</Button>
)}
        

          </CardActions>
        </Card>
    );
}

export default Post;
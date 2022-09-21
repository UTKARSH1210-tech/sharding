import styles from './styles.module.css';
import React, { useState , useEffect } from 'react';
// import Picker from 'emoji-picker-react';
import InputEmoji from 'react-input-emoji'
import { useQuill } from 'react-quilljs';
import { MentionsInput, Mention } from 'react-mentions'
import 'quill/dist/quill.snow.css'; 

// import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { EditorState } from 'draft-js';
// import ControlledEditor from './ControlledEditor';
import ReactQuillBar from './ReactQuillBar';



const SendMessage = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");
  const [user , setUser] = useState([])


  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      // console.log(data);
      setUser(data);
    });

    return () => socket.off('chatroom_users');
  }, [socket]);

  // console.log(user[0]?.username)

  const [text, setText] = useState("");
  const theme = 'snow';
  const modules = {
    toolbar: '#toolbar'
    // [
    //   ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    //     ['blockquote', 'code-block'],

    //     // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    //     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //     // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    //     [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    //     [{ 'direction': 'rtl' }],                         // text direction
    //     ['link', 'image'],
    //     // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    //     // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    //     // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    //     // [{ 'font': [] }],
    //     [{ 'align': [] }],

    //     ['clean']                                         // remove formatting button
    // ],

    
  };

  const formats = ['bold', 'italic', 'underline', 'strike' , 'code-block' , 'blockquote' , 'font',
	    'size', 'list', 'bullet', 'align', 'link' , 'indent' , 'direction'];
  const { quill, quillRef } = useQuill({modules , formats});

  var msg;
  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        // quill.getText();
        setMessage(quillRef.current.firstChild.innerHTML);
        // console.log('Text change!');
        // console.log(quill.getText()); // Get text only
        // console.log(quill.getContents()); // Get delta contents
        // console.log(quill.root.innerHTML); // Get innerHTML using quill
        // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill]);
  // setMessage(msg);
  // console.log(message,"->")
  
  function handleOnEnter(text) {
    (e) => setMessage(e.target.value)
    console.log("enter", text);
  }
  
  const sendMessage = () => {
    console.log(message);
    if (message !== '') {
      // <div>message</div>
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit('send_message', { username, room, message, __createdtime__ });
      setMessage('');
      
    }
    // return ""
  };


  

 
  const openup = () => {
    // console.log(user)
    user.map((val , i) => (
      
      <li>
        console.log(val[i]?.username)
        {val[i]?.username}
      </li>
    ))
  }
  return (
    <div >
  
    
    {/* <InputEmoji
      // fontSize={150}
      value={message}
      // cleanOnEnter
      onEnter={sendMessage}
      onChange={(e) => { setMessage(e)}}
      placeholder="Type a message"
    /> */}
    {/* <input
        className={styles.messageInput}
        value={message}
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)}
        
      /> */}
      <div 
      className={styles.messageInput}>
        <div ref={quillRef} />
        <div id="editor" >
        </div>
        
        <div id="toolbar">
        
        {/* <select className="ql-size">
          <option value="small" />
          <option selected />
          <option value="large" />
          <option value="huge" />
        </select> */}
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote" />
          <button className="ql-code-block" />
          {/* <button className="ql-direction" /> */}
        </span>

        <span className="ql-formats">
          <button className="ql-link" />
          <button className="ql-image" />
          <button className="ql-video" />
          <button style={{padding : '2px'}} onClick={openup}>+</button>
        </span>
        {/* <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" /> */}
      </div>
      
      </div>
      {/* <ControlledEditor/> */}
      
    <button className='btn btn-primary' onClick={sendMessage} onChange={handleOnEnter}>
        Send Message
    </button>
    


    </div>
  );
};

export default SendMessage;
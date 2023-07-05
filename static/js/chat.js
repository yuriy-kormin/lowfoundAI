function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function getApiResponse(query,variables={}){
    const csrftoken = getCookie('csrftoken');
    try {
      const response = await fetch('/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables
            }),
      });
      const data = await response.json();
       return data['data']
    } catch (error) {
     console.error('Error:', error);
    }
}

async function retriveUserMessages () {
    const query = `
            query {
              history {
                id
                date
                request
                response
              }
            }
        `
    const response = await getApiResponse(query)
    return response['history']
}

function make_div(classNames){
    const result = document.createElement("div");
    if (typeof classNames !== 'string'){
        result.classList.add(...classNames);
    } else {
        result.classList.add(classNames);
    }
    return result
}

function make_string(data){
    const dataRoot = make_div('row');
    dataRoot.classList.add('pb-2')
        const dataCell =make_div('col-12');
        dataCell.textContent = data
        dataRoot.appendChild(dataCell)
    return dataRoot
}
function make_message(message){
    const rootDiv = make_div('row')
     rootDiv.setAttribute('id', message['id']);
        const messageDiv=make_div('col-12')
        rootDiv.classList.add('m-2')
        rootDiv.style.backgroundColor="#F5F5F5";

        //create date
        const dataRoot = make_string(message['date'])

        messageDiv.appendChild(dataRoot)
        //create request

        const requestHeader = make_string("You asked:")
        requestHeader.classList.add('text-primary')
        const requestRoot = make_string(message['request'])
        messageDiv.appendChild(requestHeader)
        messageDiv.appendChild(requestRoot)
        
        //create response
        const responseHeader = make_string("GPT responded:")
        responseHeader.classList.add('text-primary')
        const responseRoot = make_string(message['response'])
        messageDiv.appendChild(responseHeader)
        messageDiv.appendChild(responseRoot)

        //create remove link
        const hrefColDiv = make_div('row')
        hrefColDiv.classList.add('text-warning')
        const hrefDiv=make_div('col-12')
            const Removelink = document.createElement('a');
            Removelink.setAttribute('href', `javascript:removeMessage(${message['id']})`);
            Removelink.classList.add('text-danger')
            Removelink.textContent = 'Delete';
            hrefDiv.appendChild(Removelink)
        hrefColDiv.appendChild(hrefDiv)
        messageDiv.appendChild(hrefColDiv)

    rootDiv.appendChild(messageDiv);
    return rootDiv
}


function pause(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

async function makeRemoveRequest(id){
 const query = `
            mutation{
              removeMessage(id:${id}){
                success
              }
            }
        `
    const response = await getApiResponse(query)
    return response['removeMessage']
}

function removeDiv(div) {
    while (div.firstChild) {
    removeDiv(div.firstChild);
    div.removeChild(div.firstChild);
  }

}

function removeMessage(id){
    const messageDiv=document.getElementById(id)
    if (id){

        makeRemoveRequest(id).then(result=>{
            if (result['success']) {
                removeDiv(messageDiv)
                messageDiv.remove()
            }
        })
    } else {
        console.error('cannot remove message')
    }

    const root = document.getElementById('chat_history')
    if (root.children.length === 1) {
        root.appendChild(render_history_is_empty())
    }

}


function render_history_is_empty() {
    const rootDiv = make_div('row')
    const messageDiv=make_div('col-12')
    messageDiv.classList.add('m-2')
    messageDiv.style.backgroundColor="#F5F5F5";
    messageDiv.textContent="Your chat is empty. Send your first message to start a chat."
    rootDiv.appendChild(messageDiv)
    return rootDiv
}
function renderHistory(){
    const root = document.getElementById('chat_history')
    retriveUserMessages().then(result =>{
        if (result.length) {
            result.forEach(message => {
                const div = make_message(message)
                root.appendChild(div)
            })
        } else {
            root.appendChild(render_history_is_empty())
        }
    })
}

function checkClass(field,buttonId,...neighbors){
    const button = document.getElementById(buttonId)
    if (button.classList.contains('btn-primary')) {
        return
    }
    // console.log(button)
    if (field.value.length){
        let fill=true
        if (neighbors.length) {
            for (const neighbor of neighbors) {
                const el = document.getElementById(neighbor)
                if (!el.value.length) {
                    fill = false;
                    break;
                }
            }
        }
        if (fill) {
            button.classList.remove('btn-secondary')
            button.classList.add('btn-primary')
            button.removeAttribute('disabled')
        }
    }

}

async function makeRequest(text){
 const query = `
            mutation($request: String!) {
              createMessage(request:$request){
                success
                message{
                    id
                    date
                    request
                    response
                }
              }
            }
        `
    const response = await getApiResponse(query,variables={'request':text})
    return response['createMessage']
}


function sendRequest(){
    const text = document.getElementById('user_input').value;
    makeRequest(text).then(response =>{
        if (response['success']){
            const root = document.getElementById('chat_history')
            const div = make_message(response['message'])
            root.appendChild(div)
        }

    })
}
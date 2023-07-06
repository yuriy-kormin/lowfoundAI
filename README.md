## Lowfound OpenAI API Chat

### Overview 

It's a test assigment app for Lowfound company.


Its built using the Django framework and provides communication
with an AI assistant. The AI assistant is capable of responding 
to user queries and performing various tasks based on the provided input.

### Installation 

#### Get chatGPT API key
1. SignupforOpenAI:https://openai.com/
2. Create a secret APIkey in the settings section of your account:
https://platform.openai.com/account/api-keys
    
#### Install App

Need to  [poetry](https://python-poetry.org/docs/#installation) is to be installed 
 

- CLone repo

        git clone https://github.com/yuriy-kormin/lowfoundAI.git
        cd lowfoundAI/

- Rename .env-template file to .env

        mv .env-template .env


- set API key in .env file

        CHAT_GPT_KEY="YOUR_API_KEY"

- Start app

      docker compose up --build

Enjoy on http://localhost


#### Notes

This app is in development stage and can be improved further. 
For example, in [function library](https://github.com/yuriy-kormin/lowfoundAI/blob/master/lowfoundAI/chat/remote_api.py#L6C3-L6C3) 
i try to make async function to process API calls asynchroniussly way

import httpx
import requests
from django.conf import settings


async def process_api_request(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        return data


def get_AI_response(request_data):
    AI_key = settings.CHAT_GPT_KEY
    URL = 'https://api.openai.com/v1/chat/completions'
    if not AI_key:
        print('set AI key into .env file')
        return

    headers = {
        'Authorization': f'Bearer {AI_key}',
        'Content-Type': 'application/json'
    }
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": f"{request_data}"}],
        "temperature": 0.7
    }

    response = requests.post(URL, json=data, headers=headers)
    if response.status_code == 200:
        response_data = response.json()
        print(response_data, data)
        return response_data['choices'][0]['message']['content']
    else:
        return None

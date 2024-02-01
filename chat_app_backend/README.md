# Django Rest Chat App Example
This is a simple Django REST Chat App example demonstrating how to build a basic chat application using 
Django and Django REST Framework.

![cover.png](docs%2Fimages%2Fcover.png)

## Features
- User Authentication: Users can register, login, and logout.
- Real-time Chatting: Users can send and receive real-time messages in chat rooms.
- OAuth2 authentication: oauth2 authentication is used to secure API endpoints.

## Prerequisites
- Python 3.x
- Django
- Django REST Framework
- Channels
- Redis (for Channels)

## Installation
- Clone the repository:
```bash
git clone https://github.com/vitaliisili/Django_OAuth2_with_React_and_DRF
```

- Navigate into the project directory and go to the backend folder:
```bash
cd chat_app_backend
```

- Create and activate a virtual environment (optional but recommended):
```bash
python3 -m venv .venv
source .venv/bin/activate
```

- Install dependencies:
```bash
pip install -r requirements.txt
```
> or use Makefile ```make install```

- Create `.env` file in project root look at `.env-example` for example 
> ### Note: 
> If you do not have installed `redis` and `postgres` use docker-compose file to run them in docker (Docker is required).

- Run migration
```bash
python -m manage migrate 
```
> or use Makefile ```make migrate```

- Create superuser
```python -m manage createsuperuser```
> or use Makefile ```make createsuperuser```

- Run server
```bash
python -m manage runserver
```
> or use Makefile ```make runserver```

- Open [http://localhost:8000/admin](http://localhost:8000/admin) and login as superuser that you created earlier

- Create a new application for Oauth2 authentication click `Add` button
![application_step_1.png](docs%2Fimages%2Fapplication_step_1.png)
- `Client id` will be generated automatically
- `Client type` should be Confidential
- `Authorization grant type:` should be Resource owner password-based
![application_step_2.png](docs%2Fimages%2Fapplication_step_2.png)

> IMPORTANT: Copy and save `Client secret` before saving application because it will hashed on save.

## Contributing
Contributions are welcome! If you'd like to improve this example, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
This project was inspired by the need for a simple Django REST chat app example.

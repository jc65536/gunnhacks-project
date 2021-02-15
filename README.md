# gunnhacks-project
Gunnhacks project

### How to run frontend:
```
cd react-frontend
npm install package.json (if this is your first time)
npm start
```

### Frontend notes:
- The api routes are simply `/api/[endpoint]` because in `package.json` we put a proxy field of `http://localhost:5000`

### How to run backend

Installing Dependencies:<br>
`pip install -r requirements.txt`

Setting Up App: <br>
`python setup.py`

Running Flask App:
```shell
export FLASK_APP=api (Unix)
set FLASK_APP=api (Windows CMD)

flask run
```

```
# Set flask to dev mode
export FLASK_ENV=development
```